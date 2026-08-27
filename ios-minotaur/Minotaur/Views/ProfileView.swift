import SwiftUI

struct ProfileView: View {
    @Environment(AppState.self) private var state
    @State private var path: [Labyrinth] = []
    @State private var showBuilder = false

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: 30) {
                    header
                    if showBuilder {
                        BuilderPanel { labyrinth in
                            withAnimation(.easeOut(duration: 0.2)) { showBuilder = false }
                            path.append(labyrinth)
                        }
                        .padding(.horizontal, 20)
                        .transition(.opacity.combined(with: .move(edge: .top)))
                    }
                    founded
                    gallery
                    Color.clear.frame(height: 80)
                }
                .padding(.top, 18)
            }
            .scrollIndicators(.hidden)
            .background(Ink.canvas)
            .navigationDestination(for: Labyrinth.self) { LabyrinthDetailView(labyrinthID: $0.id) }
        }
        .tint(.white)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 18) {
            MediaBox(ref: state.user.avatar, height: 96)
                .frame(width: 96)
                .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
                .overlay(alignment: .bottom) {
                    Chip(text: state.user.verified ? "Verified" : "Member", inverted: true)
                        .offset(y: 9)
                }

            VStack(alignment: .leading, spacing: 8) {
                Display(text: state.user.name, size: 26)
                HStack(alignment: .top, spacing: 10) {
                    Rectangle().fill(Color.white).frame(width: 2, height: 28)
                    Text(state.user.tagline.uppercased())
                        .font(.system(size: 12, weight: .semibold))
                        .tracking(0.8)
                        .foregroundStyle(Ink.muted)
                }
            }
            .padding(.top, 8)

            HStack(spacing: 0) {
                stat(value: "\(state.owned.count)", label: "Founded\nLabyrinths")
                Rectangle().fill(Ink.hairline).frame(width: 1, height: 40)
                stat(value: memberTotal, label: "Total\nMembers")
            }

            SlabButton(title: showBuilder ? "Close Builder" : "Create New Labyrinth",
                       filled: !showBuilder,
                       height: 48) {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) { showBuilder.toggle() }
            }
        }
        .padding(.horizontal, 20)
    }

    private func stat(value: String, label: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(value)
                .font(.system(size: 22, weight: .black, design: .monospaced))
                .foregroundStyle(.white)
            Text(label.uppercased())
                .font(.system(size: 9, weight: .bold, design: .monospaced))
                .tracking(1.2)
                .foregroundStyle(Ink.faint)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.leading, 4)
    }

    private var memberTotal: String {
        let total = state.owned.reduce(0) { $0 + $1.memberCount }
        return total >= 1_000 ? String(format: "%.1fK", Double(total) / 1_000) : "\(total)"
    }

    private var founded: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Founded Labyrinths", trailing: "View all", rule: false)
                .padding(.horizontal, 20)
            VStack(spacing: 12) {
                ForEach(Array(state.owned.enumerated()), id: \.element.id) { index, labyrinth in
                    Button {
                        Haptics.tap()
                        path.append(labyrinth)
                    } label: {
                        FoundedRow(index: index + 1, labyrinth: labyrinth)
                    }
                    .buttonStyle(PressStyle())
                }
                if state.owned.isEmpty {
                    Panel {
                        Text("You have not founded a labyrinth yet.")
                            .font(.system(size: 14))
                            .foregroundStyle(Ink.muted)
                    }
                }
            }
            .padding(.horizontal, 20)
        }
    }

    private var gallery: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Progress Feed", trailing: "Latest updates", rule: false)
                .padding(.horizontal, 20)

            let photos = state.progressGallery
            if photos.isEmpty {
                Panel {
                    VStack(alignment: .leading, spacing: 8) {
                        MonoLabel(text: "Nothing published", size: 10)
                        Text("Post a progress update inside a labyrinth community and it will appear here.")
                            .font(.system(size: 13))
                            .foregroundStyle(Ink.muted)
                    }
                }
                .padding(.horizontal, 20)
            } else {
                LazyVGrid(columns: [GridItem(.flexible(), spacing: 2), GridItem(.flexible(), spacing: 2)], spacing: 2) {
                    ForEach(Array(photos.enumerated()), id: \.offset) { _, photo in
                        MediaBox(ref: photo, height: 170)
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }
}

/// Inline labyrinth builder — the MVP version of the full routine editor.
private struct BuilderPanel: View {
    @Environment(AppState.self) private var state
    let onCreate: (Labyrinth) -> Void

    @State private var name: String = ""
    @State private var tagline: String = ""
    @State private var isPublic = true
    @State private var isPaid = false
    @State private var weeks: Int = 12
    @State private var daysPerWeek: Int = 4

    var body: some View {
        Panel(padding: 18) {
            VStack(alignment: .leading, spacing: 18) {
                HStack {
                    Display(text: "Create New Labyrinth", size: 17)
                    Spacer()
                    Image(systemName: "plus.circle")
                        .font(.system(size: 16))
                        .foregroundStyle(Ink.muted)
                }

                field(title: "Name", text: $name, placeholder: "AXIAL LOADING DEPTH")
                field(title: "Tagline", text: $tagline, placeholder: "WHAT IS THIS PATH FOR?")

                toggleRow(label: "Visibility", left: "Public", right: "Private", isLeft: $isPublic)
                toggleRow(label: "Access", left: "Free", right: "Paid", isLeft: Binding(
                    get: { !isPaid },
                    set: { isPaid = !$0 }
                ))

                HStack(spacing: 18) {
                    stepper(label: "Weeks", value: $weeks, range: 1...52)
                    stepper(label: "Days / Week", value: $daysPerWeek, range: 1...7)
                }

                SlabButton(title: "Create", height: 48) {
                    let labyrinth = state.createLabyrinth(
                        name: name,
                        tagline: tagline,
                        weeks: weeks,
                        daysPerWeek: daysPerWeek,
                        isPublic: isPublic,
                        price: isPaid ? 29 : nil
                    )
                    Haptics.success()
                    onCreate(labyrinth)
                }
            }
        }
    }

    private func field(title: String, text: Binding<String>, placeholder: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            MonoLabel(text: title, size: 9, color: Ink.faint)
            TextField("", text: text, prompt: Text(placeholder)
                .font(.system(size: 12, weight: .semibold, design: .monospaced))
                .foregroundColor(Ink.faint))
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white)
                .padding(.horizontal, 12)
                .frame(height: 42)
                .background(Ink.raised)
                .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
        }
    }

    private func toggleRow(label: String, left: String, right: String, isLeft: Binding<Bool>) -> some View {
        HStack {
            MonoLabel(text: label, size: 10, color: Ink.muted)
            Spacer()
            HStack(spacing: 0) {
                segment(title: left, active: isLeft.wrappedValue) { isLeft.wrappedValue = true }
                segment(title: right, active: !isLeft.wrappedValue) { isLeft.wrappedValue = false }
            }
        }
    }

    private func segment(title: String, active: Bool, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.soft()
            withAnimation(.easeOut(duration: 0.15)) { action() }
        } label: {
            Text(title.uppercased())
                .font(.system(size: 9, weight: .black, design: .monospaced))
                .tracking(1.2)
                .foregroundStyle(active ? .black : Ink.muted)
                .padding(.horizontal, 14)
                .frame(height: 30)
                .background(active ? Color.white : Color.clear)
                .overlay(Rectangle().strokeBorder(active ? Color.clear : Ink.hairline, lineWidth: 1))
        }
        .buttonStyle(.plain)
    }

    private func stepper(label: String, value: Binding<Int>, range: ClosedRange<Int>) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            MonoLabel(text: label, size: 9, color: Ink.faint)
            HStack {
                Text("\(value.wrappedValue)")
                    .font(.system(size: 18, weight: .black, design: .monospaced))
                    .foregroundStyle(.white)
                Spacer()
                Button {
                    Haptics.soft()
                    value.wrappedValue = max(range.lowerBound, value.wrappedValue - 1)
                } label: {
                    Image(systemName: "minus").font(.system(size: 12, weight: .black)).foregroundStyle(Ink.muted)
                        .frame(width: 30, height: 30)
                }
                Button {
                    Haptics.soft()
                    value.wrappedValue = min(range.upperBound, value.wrappedValue + 1)
                } label: {
                    Image(systemName: "plus").font(.system(size: 12, weight: .black)).foregroundStyle(.white)
                        .frame(width: 30, height: 30)
                }
            }
            .padding(.horizontal, 10)
            .frame(height: 42)
            .background(Ink.raised)
            .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
        }
        .frame(maxWidth: .infinity)
    }
}
