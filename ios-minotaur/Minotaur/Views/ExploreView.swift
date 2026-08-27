import SwiftUI

struct ExploreView: View {
    @Environment(AppState.self) private var state
    @State private var path: [Labyrinth] = []
    @State private var query: String = ""
    @State private var category: String = "All"

    private var categories: [String] {
        ["All"] + Array(Set(state.labyrinths.map(\.category))).sorted()
    }

    private var results: [Labyrinth] {
        state.labyrinths.filter { labyrinth in
            let matchesCategory = category == "All" || labyrinth.category == category
            let matchesQuery = query.isEmpty
                || labyrinth.name.localizedStandardContains(query)
                || labyrinth.ownerHandle.localizedStandardContains(query)
            return matchesCategory && matchesQuery
        }
    }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: 30) {
                    search
                    chips
                    forYou
                    trendingRail
                    Color.clear.frame(height: 80)
                }
                .padding(.top, 14)
            }
            .scrollIndicators(.hidden)
            .background(Ink.canvas)
            .navigationDestination(for: Labyrinth.self) { LabyrinthDetailView(labyrinthID: $0.id) }
        }
        .tint(.white)
    }

    private var search: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Ink.muted)
            TextField("", text: $query, prompt: Text("FIND YOUR LABYRINTH...")
                .font(.system(size: 11, weight: .bold, design: .monospaced))
                .foregroundColor(Ink.faint))
                .font(.system(size: 13, weight: .semibold, design: .monospaced))
                .foregroundStyle(.white)
                .autocorrectionDisabled()
        }
        .padding(.horizontal, 14)
        .frame(height: 46)
        .background(Ink.surface)
        .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
        .padding(.horizontal, 20)
    }

    private var chips: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 8) {
                ForEach(categories, id: \.self) { item in
                    Button {
                        Haptics.soft()
                        withAnimation(.easeOut(duration: 0.15)) { category = item }
                    } label: {
                        Text(item.uppercased())
                            .font(.system(size: 10, weight: .black, design: .monospaced))
                            .tracking(1.4)
                            .foregroundStyle(category == item ? .black : Ink.muted)
                            .padding(.horizontal, 14)
                            .frame(height: 34)
                            .background(category == item ? Color.white : Color.clear)
                            .overlay(Rectangle().strokeBorder(category == item ? Color.clear : Ink.hairline, lineWidth: 1))
                    }
                    .buttonStyle(PressStyle())
                }
            }
        }
        .scrollIndicators(.hidden)
        .contentMargins(.horizontal, 20, for: .scrollContent)
    }

    private var forYou: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "For You", trailing: "\(results.count) paths")
                .padding(.horizontal, 20)
            VStack(spacing: 14) {
                ForEach(results.prefix(3)) { labyrinth in
                    Button {
                        Haptics.tap()
                        path.append(labyrinth)
                    } label: {
                        CoverCard(labyrinth: labyrinth)
                    }
                    .buttonStyle(PressStyle())
                }
                if results.isEmpty {
                    Panel {
                        Text("Nothing matches that search.")
                            .font(.system(size: 14))
                            .foregroundStyle(Ink.muted)
                    }
                }
            }
            .padding(.horizontal, 20)
        }
    }

    private var trendingRail: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Display(text: "Trending This Week", size: 19)
                Spacer()
                Image(systemName: "chart.line.uptrend.xyaxis")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(Ink.muted)
            }
            .padding(.horizontal, 20)

            ScrollView(.horizontal) {
                HStack(spacing: 12) {
                    ForEach(state.labyrinths.sorted { $0.memberCount > $1.memberCount }) { labyrinth in
                        Button {
                            Haptics.tap()
                            path.append(labyrinth)
                        } label: {
                            VStack(alignment: .leading, spacing: 0) {
                                MediaBox(ref: labyrinth.cover, height: 150, dim: 0.2)
                                VStack(alignment: .leading, spacing: 8) {
                                    MonoLabel(text: "Program by \(labyrinth.ownerHandle)", size: 9, color: Ink.faint)
                                    Display(text: labyrinth.name, size: 16)
                                    HStack(spacing: 14) {
                                        MonoLabel(text: "\(labyrinth.weeks) weeks", size: 9, color: Ink.faint, icon: "clock")
                                        MonoLabel(text: labyrinth.level, size: 9, color: Ink.faint, icon: "bolt.fill")
                                    }
                                }
                                .padding(12)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            }
                            .frame(width: 250)
                            .background(Ink.surface)
                            .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
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
