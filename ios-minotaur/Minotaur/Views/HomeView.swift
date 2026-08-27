import SwiftUI

struct HomeView: View {
    @Environment(AppState.self) private var state
    @State private var path: [Labyrinth] = []

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: 34) {
                    yourLabyrinths
                    if let active = state.activeLabyrinth { todayCard(active) }
                    trending
                    Color.clear.frame(height: 80)
                }
                .padding(.top, 12)
            }
            .scrollIndicators(.hidden)
            .background(Ink.canvas)
            .safeAreaInset(edge: .top) { topBar }
            .navigationDestination(for: Labyrinth.self) { LabyrinthDetailView(labyrinthID: $0.id) }
        }
        .tint(.white)
    }

    private var topBar: some View {
        HStack {
            Image(systemName: "line.3.horizontal")
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(Ink.muted)
            Spacer()
            Text("MINOTAUR")
                .font(.system(size: 16, weight: .black))
                .tracking(4)
                .foregroundStyle(.white)
            Spacer()
            Image(systemName: "bell")
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(Ink.muted)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(Color.black)
        .overlay(alignment: .bottom) { Rectangle().fill(Ink.hairline).frame(height: 1) }
    }

    @ViewBuilder private var yourLabyrinths: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Display(text: "Your Labyrinths", size: 20)
                Spacer()
                MonoLabel(text: "View all", size: 9, color: Ink.faint)
            }
            .padding(.horizontal, 20)

            if state.joined.isEmpty {
                Panel {
                    VStack(alignment: .leading, spacing: 12) {
                        MonoLabel(text: "No active path", size: 10)
                        Text("You have not entered a labyrinth yet. Explore the archive and enlist.")
                            .font(.system(size: 14))
                            .foregroundStyle(Ink.muted)
                    }
                }
                .padding(.horizontal, 20)
            } else {
                ScrollView(.horizontal) {
                    HStack(spacing: 12) {
                        ForEach(state.joined) { labyrinth in
                            Button {
                                Haptics.tap()
                                path.append(labyrinth)
                            } label: {
                                RailCard(labyrinth: labyrinth, progress: state.progress(in: labyrinth))
                            }
                            .buttonStyle(PressStyle())
                        }
                    }
                }
                .scrollIndicators(.hidden)
                .contentMargins(.horizontal, 20, for: .scrollContent)
            }
        }
    }

    @ViewBuilder private func todayCard(_ labyrinth: Labyrinth) -> some View {
        if let day = state.today(in: labyrinth) {
            Panel(padding: 18) {
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        MonoLabel(text: day.header, size: 10, color: Ink.muted)
                        Spacer()
                        Image(systemName: "pencil")
                            .font(.system(size: 12))
                            .foregroundStyle(Ink.faint)
                    }
                    Display(text: labyrinth.name, size: 23)

                    VStack(spacing: 0) {
                        ForEach(Array(day.blocks.prefix(3).enumerated()), id: \.element.id) { index, block in
                            HStack(alignment: .top) {
                                if index == 0 {
                                    Rectangle().fill(Color.white).frame(width: 2, height: 30)
                                        .padding(.trailing, 8)
                                }
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(block.name.uppercased())
                                        .font(.system(size: 13, weight: .black))
                                        .tracking(0.6)
                                        .foregroundStyle(.white)
                                    Text("Target: \(block.target)")
                                        .font(.system(size: 11))
                                        .foregroundStyle(Ink.faint)
                                }
                                Spacer()
                                Text("\(block.sets) x \(block.reps)")
                                    .font(.system(size: 13, weight: .bold, design: .monospaced))
                                    .foregroundStyle(.white)
                            }
                            .padding(.vertical, 10)
                            if index < min(2, day.blocks.count - 1) {
                                Rectangle().fill(Ink.hairline).frame(height: 1)
                            }
                        }
                    }

                    SlabButton(title: "Enter Labyrinth") {
                        path.append(labyrinth)
                    }
                }
            }
            .padding(.horizontal, 20)
            .overlay(alignment: .bottom) {
                MonoLabel(text: "See more history", size: 9, color: Ink.faint)
                    .offset(y: 24)
            }
        }
    }

    private var trending: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Trending", rule: false)
                .padding(.horizontal, 20)
            VStack(spacing: 12) {
                ForEach(state.labyrinths.filter { !state.isMember(of: $0) }.prefix(4)) { labyrinth in
                    TrendingCard(labyrinth: labyrinth, joined: false) {
                        path.append(labyrinth)
                    }
                }
            }
            .padding(.horizontal, 20)
        }
        .padding(.top, 12)
    }
}
