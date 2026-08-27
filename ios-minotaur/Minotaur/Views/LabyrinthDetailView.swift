import SwiftUI

struct LabyrinthDetailView: View {
    @Environment(AppState.self) private var state
    @Environment(\.dismiss) private var dismiss

    let labyrinthID: UUID
    @State private var tab: Int = 0
    @State private var showWorkout = false

    private var labyrinth: Labyrinth? {
        state.labyrinths.first { $0.id == labyrinthID }
    }

    var body: some View {
        Group {
            if let labyrinth {
                content(labyrinth)
            } else {
                Ink.canvas
            }
        }
        .background(Ink.canvas)
        .navigationBarBackButtonHidden()
        .toolbar(.hidden, for: .navigationBar)
        .fullScreenCover(isPresented: $showWorkout) {
            if let labyrinth, let day = state.today(in: labyrinth) {
                ActiveWorkoutView(labyrinth: labyrinth, day: day)
                    .environment(state)
            }
        }
    }

    private func content(_ labyrinth: Labyrinth) -> some View {
        VStack(spacing: 0) {
            header(labyrinth)
            tabBar(labyrinth)
            Group {
                if tab == 0 {
                    ArchitectureTab(labyrinth: labyrinth, startWorkout: { showWorkout = true })
                } else {
                    CommunityTab(labyrinth: labyrinth)
                }
            }
        }
    }

    private func header(_ labyrinth: Labyrinth) -> some View {
        VStack(spacing: 0) {
            HStack {
                Button {
                    Haptics.soft()
                    dismiss()
                } label: {
                    Image(systemName: "arrow.left")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                        .contentShape(Rectangle())
                }
                Spacer()
                Text("LABYRINTHS")
                    .font(.system(size: 15, weight: .black))
                    .tracking(3)
                    .foregroundStyle(.white)
                Spacer()
                Color.clear.frame(width: 44, height: 44)
            }
            .padding(.horizontal, 8)

            VStack(alignment: .leading, spacing: 8) {
                MonoLabel(text: state.isMember(of: labyrinth) ? "Active program" : "Archive entry",
                          size: 10,
                          color: Ink.muted,
                          icon: "folder")
                Display(text: labyrinth.name, size: 27)
                if let day = state.today(in: labyrinth) {
                    Text(day.header.uppercased())
                        .font(.system(size: 15, weight: .bold))
                        .tracking(1.2)
                        .foregroundStyle(Ink.muted)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 20)
            .padding(.top, 6)
            .padding(.bottom, 16)
        }
        .background(Color.black)
        .overlay(alignment: .bottom) { Rectangle().fill(Ink.hairline).frame(height: 1) }
    }

    private func tabBar(_ labyrinth: Labyrinth) -> some View {
        HStack(spacing: 24) {
            ForEach(Array(["Architecture", "Community"].enumerated()), id: \.offset) { index, title in
                Button {
                    Haptics.soft()
                    withAnimation(.easeOut(duration: 0.18)) { tab = index }
                } label: {
                    VStack(spacing: 8) {
                        Text(title.uppercased())
                            .font(.system(size: 11, weight: .black, design: .monospaced))
                            .tracking(1.6)
                            .foregroundStyle(tab == index ? .white : Ink.faint)
                        Rectangle()
                            .fill(tab == index ? Color.white : Color.clear)
                            .frame(height: 2)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            Spacer()
            if let membership = state.membership(for: labyrinth) {
                MonoLabel(text: "Day \(membership.currentDay) of \(labyrinth.totalDays)", size: 10, color: .white)
            } else {
                MonoLabel(text: "\(labyrinth.totalDays) days", size: 10, color: Ink.faint)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 14)
        .background(Ink.canvas)
    }
}

// MARK: - Architecture

private struct ArchitectureTab: View {
    @Environment(AppState.self) private var state
    let labyrinth: Labyrinth
    let startWorkout: () -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 26) {
                if state.isMember(of: labyrinth) {
                    if state.isComplete(labyrinth) {
                        completion
                    }
                    currentOperation
                    previousOperation
                } else {
                    enlist
                }
                structure
                Color.clear.frame(height: 90)
            }
            .padding(.top, 20)
        }
        .scrollIndicators(.hidden)
    }

    @ViewBuilder private var currentOperation: some View {
        if let day = state.today(in: labyrinth) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    MonoLabel(text: "Current operation", size: 10, color: .white)
                    Spacer()
                    MonoLabel(text: "\(day.estimatedMinutes) min est.", size: 9, color: Ink.faint)
                }
                .padding(.horizontal, 20)

                VStack(spacing: 0) {
                    MediaBox(ref: labyrinth.cover, height: 190, dim: 0.25)
                        .overlay(alignment: .bottomLeading) {
                            HStack(spacing: 6) {
                                Image(systemName: "play.circle")
                                Text("PROTOCOL PREVIEW")
                                    .font(.system(size: 9, weight: .black, design: .monospaced))
                                    .tracking(1.3)
                            }
                            .foregroundStyle(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 7)
                            .background(.ultraThinMaterial)
                            .padding(12)
                        }

                    VStack(alignment: .leading, spacing: 18) {
                        VStack(alignment: .leading, spacing: 8) {
                            MonoLabel(text: "Session notes", size: 9, color: Ink.faint, icon: "doc.text")
                            Text(day.notes)
                                .font(.system(size: 14))
                                .foregroundStyle(Ink.muted)
                                .lineSpacing(4)
                        }

                        if !day.blocks.isEmpty {
                            VStack(alignment: .leading, spacing: 10) {
                                MonoLabel(text: "Exercise preview", size: 9, color: Ink.faint, icon: "list.bullet")
                                ForEach(day.blocks.prefix(2)) { block in
                                    HStack {
                                        Text(block.name.uppercased())
                                            .font(.system(size: 13, weight: .black))
                                            .tracking(0.5)
                                            .foregroundStyle(.white)
                                        Spacer()
                                        Text("\(block.sets) x \(block.reps)")
                                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                                            .foregroundStyle(Ink.muted)
                                    }
                                    .padding(.vertical, 8)
                                    .overlay(alignment: .bottom) { Rectangle().fill(Ink.hairline).frame(height: 1) }
                                }
                                if day.blocks.count > 2 {
                                    MonoLabel(text: "+ \(day.blocks.count - 2) more movements", size: 9, color: Ink.faint)
                                        .padding(.top, 4)
                                }
                            }
                        }

                        SlabButton(title: day.isRest ? "Log Recovery" : "Enter Labyrinth", icon: "arrow.right") {
                            startWorkout()
                        }
                    }
                    .padding(16)
                }
                .background(Ink.surface)
                .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
                .padding(.horizontal, 20)
            }
        }
    }

    @ViewBuilder private var previousOperation: some View {
        if let previous = state.previousDay(in: labyrinth), let membership = state.membership(for: labyrinth) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    MonoLabel(text: "Yesterday's operation", size: 10, color: Ink.muted)
                    Spacer()
                    MonoLabel(text: "Completed", size: 9, color: Ink.faint, icon: "checkmark")
                }
                Panel {
                    VStack(alignment: .leading, spacing: 8) {
                        MonoLabel(text: "Day \(previous.number)", size: 9, color: Ink.faint)
                        Display(text: previous.title, size: 18)
                        Text("Volume: \(membership.lastVolume ?? 0) lbs  ·  Duration: \(membership.lastDuration ?? 0)m")
                            .font(.system(size: 12))
                            .foregroundStyle(Ink.muted)
                    }
                }
            }
            .padding(.horizontal, 20)
        }
    }

    private var completion: some View {
        Panel(padding: 24) {
            VStack(spacing: 14) {
                Image(systemName: "diamond")
                    .font(.system(size: 40, weight: .ultraLight))
                    .foregroundStyle(.white)
                Display(text: "Congratulations", size: 22)
                Text("You have successfully navigated the \(labyrinth.name). \(labyrinth.totalDays) days of structured discipline executed. Your blueprint is complete.")
                    .font(.system(size: 13))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Ink.muted)
                MonoLabel(text: "Share completion", size: 10, color: .white, icon: "square.and.arrow.up")
            }
            .frame(maxWidth: .infinity)
        }
        .padding(.horizontal, 20)
    }

    private var enlist: some View {
        VStack(alignment: .leading, spacing: 16) {
            MediaBox(ref: labyrinth.cover, height: 200, dim: 0.2)
            VStack(alignment: .leading, spacing: 14) {
                Text(labyrinth.tagline)
                    .font(.system(size: 15))
                    .foregroundStyle(Ink.muted)
                    .lineSpacing(4)
                HStack(spacing: 10) {
                    Chip(text: "\(labyrinth.weeks) weeks")
                    Chip(text: labyrinth.level)
                    Chip(text: labyrinth.priceLabel, inverted: true)
                }
                SlabButton(title: "Enlist") {
                    state.join(labyrinth)
                    Haptics.success()
                }
            }
            .padding(.horizontal, 20)
        }
    }

    private var structure: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                MonoLabel(text: "Program structure", size: 10, color: .white)
                Spacer()
                MonoLabel(text: "\(labyrinth.totalDays) operations", size: 9, color: Ink.faint)
            }
            .padding(.horizontal, 20)

            VStack(spacing: 6) {
                ForEach(labyrinth.days) { day in
                    let done = state.membership(for: labyrinth)?.completedDays.contains(day.number) ?? false
                    let current = state.membership(for: labyrinth)?.currentDay == day.number
                    HStack(spacing: 12) {
                        Text(String(format: "%02d", day.number))
                            .font(.system(size: 12, weight: .black, design: .monospaced))
                            .foregroundStyle(current ? .black : Ink.faint)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(day.title.uppercased())
                                .font(.system(size: 12, weight: .black))
                                .tracking(0.8)
                                .foregroundStyle(current ? .black : .white)
                            Text(day.isRest ? "Recovery" : "\(day.blocks.count) blocks · \(day.estimatedMinutes)m")
                                .font(.system(size: 10, weight: .medium, design: .monospaced))
                                .foregroundStyle(current ? Color.black.opacity(0.6) : Ink.faint)
                        }
                        Spacer()
                        if done {
                            Image(systemName: "checkmark")
                                .font(.system(size: 11, weight: .black))
                                .foregroundStyle(current ? .black : Ink.muted)
                        }
                    }
                    .padding(.horizontal, 14)
                    .frame(height: 54)
                    .background(current ? Color.white : Ink.surface)
                    .overlay(Rectangle().strokeBorder(current ? Color.clear : Ink.hairline, lineWidth: 1))
                }
            }
            .padding(.horizontal, 20)
        }
    }
}
