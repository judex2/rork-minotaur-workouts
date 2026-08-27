import SwiftUI

struct CommunityTab: View {
    @Environment(AppState.self) private var state
    let labyrinth: Labyrinth

    @State private var showCompose = false
    @State private var showThread = false
    @State private var showOwnerSettings = false

    private var isOwner: Bool { state.isOwner(of: labyrinth) }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            ScrollView {
                VStack(spacing: 14) {
                    dmRow
                    ForEach(state.posts(in: labyrinth)) { post in
                        PostCard(post: post, isOwner: isOwner)
                    }
                    if state.posts(in: labyrinth).isEmpty {
                        Panel {
                            VStack(alignment: .leading, spacing: 8) {
                                MonoLabel(text: "Silent corridor", size: 10)
                                Text("No one has posted here yet. Be the first to log an update.")
                                    .font(.system(size: 13))
                                    .foregroundStyle(Ink.muted)
                            }
                        }
                    }
                    Color.clear.frame(height: 100)
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
            }
            .scrollIndicators(.hidden)

            if state.isMember(of: labyrinth) || isOwner {
                Button {
                    Haptics.tap()
                    showCompose = true
                } label: {
                    Image(systemName: "pencil")
                        .font(.system(size: 18, weight: .black))
                        .foregroundStyle(.black)
                        .frame(width: 58, height: 58)
                        .background(Color.white)
                }
                .buttonStyle(PressStyle())
                .padding(.trailing, 20)
                .padding(.bottom, 24)
            }
        }
        .sheet(isPresented: $showCompose) {
            ComposePostView(labyrinth: labyrinth)
                .environment(state)
                .presentationBackground(Ink.canvas)
        }
        .sheet(isPresented: $showThread) {
            DirectThreadView(labyrinth: labyrinth)
                .environment(state)
                .presentationBackground(Ink.canvas)
        }
        .confirmationDialog("Direct messages", isPresented: $showOwnerSettings, titleVisibility: .visible) {
            Button(labyrinth.dmEnabled ? "Turn direct messages off" : "Turn direct messages on") {
                state.setDM(!labyrinth.dmEnabled, for: labyrinth)
                Haptics.success()
            }
            Button("Cancel", role: .cancel) {}
        }
    }

    @ViewBuilder private var dmRow: some View {
        if isOwner {
            Button {
                Haptics.soft()
                showOwnerSettings = true
            } label: {
                Panel(padding: 14) {
                    HStack {
                        MonoLabel(text: "Direct line", size: 10, color: .white, icon: "envelope")
                        Spacer()
                        Chip(text: labyrinth.dmEnabled ? "On" : "Off", inverted: labyrinth.dmEnabled)
                    }
                }
            }
            .buttonStyle(PressStyle())
        } else if labyrinth.dmEnabled && state.isMember(of: labyrinth) {
            Button {
                Haptics.soft()
                showThread = true
            } label: {
                Panel(padding: 14) {
                    HStack {
                        MonoLabel(text: "Message \(labyrinth.ownerHandle)", size: 10, color: .white, icon: "envelope")
                        Spacer()
                        Image(systemName: "arrow.right")
                            .font(.system(size: 12, weight: .black))
                            .foregroundStyle(.white)
                    }
                }
            }
            .buttonStyle(PressStyle())
        }
    }
}

private struct PostCard: View {
    @Environment(AppState.self) private var state
    let post: Post
    let isOwner: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            if post.pinned {
                MonoLabel(text: "Pinned", size: 9, color: .white, icon: "pin.fill")
            }

            HStack(spacing: 12) {
                MediaBox(ref: post.authorAvatar, height: 40)
                    .frame(width: 40)
                    .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
                VStack(alignment: .leading, spacing: 3) {
                    Text(post.isFounder ? "\(post.authorName.uppercased()) [FOUNDER]" : post.authorName.uppercased())
                        .font(.system(size: 13, weight: .black))
                        .tracking(0.8)
                        .foregroundStyle(.white)
                    MonoLabel(text: post.createdAt.shortAgo, size: 9, color: Ink.faint)
                }
                Spacer()
                if post.tag != .update {
                    Chip(text: post.tag.label, inverted: post.tag == .question)
                }
            }

            Text(post.text)
                .font(.system(size: 14))
                .foregroundStyle(Ink.muted)
                .lineSpacing(4)
                .fixedSize(horizontal: false, vertical: true)

            if let pair = post.pair {
                HStack(spacing: 2) {
                    labelled(pair.baseline, "Baseline")
                    labelled(pair.current, "Day \(pair.daysIn)")
                }
                .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
            } else if let photo = post.photo {
                MediaBox(ref: photo, height: 200)
                    .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
            }

            Rectangle().fill(Ink.hairline).frame(height: 1)

            HStack(spacing: 22) {
                Button {
                    Haptics.soft()
                    state.toggleLike(post)
                } label: {
                    HStack(spacing: 7) {
                        Image(systemName: post.likedByMe ? "hand.thumbsup.fill" : "hand.thumbsup")
                            .font(.system(size: 13, weight: .semibold))
                        Text("\(post.likes)")
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                    }
                    .foregroundStyle(post.likedByMe ? .white : Ink.muted)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                HStack(spacing: 7) {
                    Image(systemName: "bubble.left").font(.system(size: 13, weight: .semibold))
                    Text("\(post.commentCount)")
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                }
                .foregroundStyle(Ink.muted)

                Spacer()

                if isOwner {
                    Button {
                        Haptics.tap()
                        state.togglePin(post)
                    } label: {
                        Image(systemName: post.pinned ? "pin.slash" : "pin")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(post.pinned ? .white : Ink.muted)
                            .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Ink.surface)
        .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
        .overlay(alignment: .leading) {
            if post.pinned {
                Rectangle().fill(Color.white).frame(width: 3)
            }
        }
    }

    private func labelled(_ ref: PhotoRef, _ caption: String) -> some View {
        MediaBox(ref: ref, height: 190)
            .overlay(alignment: .bottomLeading) {
                Chip(text: caption)
                    .background(Color.black.opacity(0.6))
                    .padding(8)
            }
    }
}
