import SwiftUI

/// Big editorial cover card used in Explore "For You".
struct CoverCard: View {
    let labyrinth: Labyrinth

    var body: some View {
        ZStack(alignment: .topLeading) {
            MediaBox(ref: labyrinth.cover, height: 260, dim: 0.25)
                .overlay(alignment: .bottom) {
                    LinearGradient(colors: [.clear, .black.opacity(0.85)], startPoint: .center, endPoint: .bottom)
                        .frame(height: 160)
                        .allowsHitTesting(false)
                }
                .overlay(alignment: .bottomLeading) {
                    VStack(alignment: .leading, spacing: 6) {
                        MonoLabel(text: labyrinth.ownerHandle, size: 9, color: Ink.muted)
                        Display(text: labyrinth.name, size: 24)
                        HStack {
                            MonoLabel(text: labyrinth.priceLabel, size: 10, color: .white)
                            Spacer()
                            Image(systemName: "arrow.right")
                                .font(.system(size: 15, weight: .black))
                                .foregroundStyle(.white)
                        }
                    }
                    .padding(16)
                }
                .overlay(alignment: .topLeading) {
                    Chip(text: labyrinth.category, inverted: true).padding(12)
                }
        }
        .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
    }
}

/// Wide list card used on Home / trending.
struct TrendingCard: View {
    let labyrinth: Labyrinth
    var joined: Bool
    let action: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            MediaBox(ref: labyrinth.cover, height: 150, dim: 0.15)
            VStack(alignment: .leading, spacing: 10) {
                HStack(alignment: .firstTextBaseline) {
                    Display(text: labyrinth.name, size: 17)
                    Spacer(minLength: 8)
                    MonoLabel(text: labyrinth.official ? "Official" : labyrinth.priceLabel,
                              size: 10,
                              color: .white)
                }
                HStack(spacing: 6) {
                    Text("by \(labyrinth.ownerHandle)")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Ink.muted)
                    if labyrinth.official {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(Ink.muted)
                    }
                }
                MonoLabel(text: "\(memberLabel) members · \(labyrinth.weeks) wks · \(labyrinth.level)",
                          size: 9,
                          color: Ink.faint)
                SlabButton(title: joined ? "Open" : "Details", filled: joined, height: 44, action: action)
                    .padding(.top, 2)
            }
            .padding(14)
        }
        .background(Ink.surface)
        .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
    }

    private var memberLabel: String {
        labyrinth.memberCount >= 1_000
            ? String(format: "%.1fK", Double(labyrinth.memberCount) / 1_000)
            : "\(labyrinth.memberCount)"
    }
}

/// Compact card for the horizontal "Your Labyrinths" rail.
struct RailCard: View {
    let labyrinth: Labyrinth
    let progress: Double

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            MediaBox(ref: labyrinth.cover, height: 120, dim: 0.3)
                .overlay(alignment: .topTrailing) {
                    Chip(text: "\(Int(progress * 100))%").padding(8)
                }
            VStack(alignment: .leading, spacing: 8) {
                Display(text: labyrinth.name, size: 15)
                    .lineLimit(2)
                MonoLabel(text: labyrinth.ownerHandle, size: 9, color: Ink.faint)
                ProgressRule(value: progress)
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(width: 210)
        .background(Ink.surface)
        .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
    }
}

/// Numbered row used in the profile's founded list.
struct FoundedRow: View {
    let index: Int
    let labyrinth: Labyrinth

    var body: some View {
        Panel {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    MonoLabel(text: String(format: "%03d", index), size: 10, color: Ink.faint)
                    Spacer()
                    Chip(text: labyrinth.priceLabel, inverted: labyrinth.price != nil)
                }
                Display(text: labyrinth.name, size: 17)
                Text(labyrinth.tagline)
                    .font(.system(size: 13))
                    .foregroundStyle(Ink.muted)
                    .lineLimit(3)
                HStack(spacing: 16) {
                    MonoLabel(text: "\(labyrinth.weeks) weeks", size: 9, color: Ink.faint, icon: "clock")
                    MonoLabel(text: labyrinth.level, size: 9, color: Ink.faint, icon: "chevron.left.forwardslash.chevron.right")
                    Spacer()
                    MonoLabel(text: "\(labyrinth.memberCount)", size: 9, color: Ink.faint, icon: "person.2")
                }
            }
        }
    }
}
