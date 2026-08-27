import SwiftUI

enum RootTab: String, CaseIterable, Hashable {
    case home, explore, profile

    var icon: String {
        switch self {
        case .home: return "house.fill"
        case .explore: return "safari"
        case .profile: return "person.fill"
        }
    }
}

struct RootView: View {
    @State private var state = AppState()
    @State private var tab: RootTab = .home
    @State private var baselineTarget: Labyrinth?

    var body: some View {
        ZStack(alignment: .bottom) {
            Ink.canvas.ignoresSafeArea()

            Group {
                switch tab {
                case .home: HomeView()
                case .explore: ExploreView()
                case .profile: ProfileView()
                }
            }
            .environment(state)
            .transition(.opacity)

            TabBar(selection: $tab)
        }
        .preferredColorScheme(.dark)
        .tint(.white)
        .onChange(of: state.baselinePrompt) { _, newValue in
            baselineTarget = newValue
        }
        .sheet(item: $baselineTarget) { labyrinth in
            BaselineCaptureView(labyrinth: labyrinth)
                .environment(state)
                .presentationBackground(Ink.canvas)
        }
    }
}

private struct TabBar: View {
    @Binding var selection: RootTab

    var body: some View {
        HStack(spacing: 0) {
            ForEach(RootTab.allCases, id: \.self) { item in
                Button {
                    guard selection != item else { return }
                    Haptics.soft()
                    withAnimation(.easeOut(duration: 0.18)) { selection = item }
                } label: {
                    VStack(spacing: 6) {
                        Image(systemName: item.icon)
                            .font(.system(size: 15, weight: .semibold))
                        Text(item.rawValue.uppercased())
                            .font(.system(size: 9, weight: .black, design: .monospaced))
                            .tracking(1.4)
                    }
                    .foregroundStyle(selection == item ? Color.black : Ink.muted)
                    .frame(maxWidth: .infinity)
                    .frame(height: 58)
                    .background(selection == item ? Color.white : Color.clear)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
        }
        .background(Color.black)
        .overlay(alignment: .top) { Rectangle().fill(Ink.hairline).frame(height: 1) }
    }
}

#Preview {
    RootView()
}
