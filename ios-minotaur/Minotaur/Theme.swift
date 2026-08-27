import SwiftUI
import UIKit

/// Core palette for the Minotaur brutalist / industrial dark theme.
enum Ink {
    static let canvas = Color(red: 0.031, green: 0.031, blue: 0.035)
    static let surface = Color(white: 0.078)
    static let raised = Color(white: 0.125)
    static let hairline = Color(white: 0.19)
    static let muted = Color(white: 0.58)
    static let faint = Color(white: 0.38)
}

/// Small uppercase monospaced caption used for every label in the app.
struct MonoLabel: View {
    let text: String
    var size: CGFloat = 10
    var color: Color = Ink.muted
    var icon: String?

    var body: some View {
        HStack(spacing: 6) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: size + 1, weight: .semibold))
            }
            Text(text.uppercased())
                .font(.system(size: size, weight: .bold, design: .monospaced))
                .tracking(1.7)
        }
        .foregroundStyle(color)
    }
}

/// Heavy condensed-feeling display type used for titles.
struct Display: View {
    let text: String
    var size: CGFloat = 28
    var color: Color = .white
    var weight: Font.Weight = .black

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: size, weight: weight))
            .tracking(size * 0.015)
            .foregroundStyle(color)
            .lineSpacing(-2)
    }
}

/// Hairline-bordered container block.
struct Panel<Content: View>: View {
    var padding: CGFloat = 16
    var fill: Color = Ink.surface
    var borderColor: Color = Ink.hairline
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(fill)
            .overlay(Rectangle().strokeBorder(borderColor, lineWidth: 1))
    }
}

struct PressStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .opacity(configuration.isPressed ? 0.75 : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

/// Full-width slab button — the app's primary call to action.
struct SlabButton: View {
    let title: String
    var icon: String?
    var filled: Bool = true
    var height: CGFloat = 54
    let action: () -> Void

    var body: some View {
        Button {
            Haptics.tap()
            action()
        } label: {
            HStack(spacing: 12) {
                Text(title.uppercased())
                    .font(.system(size: 15, weight: .black))
                    .tracking(1.8)
                if let icon {
                    Image(systemName: icon).font(.system(size: 13, weight: .black))
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: height)
            .foregroundStyle(filled ? Color.black : Color.white)
            .background(filled ? Color.white : Color.clear)
            .overlay(Rectangle().strokeBorder(filled ? Color.clear : Ink.hairline, lineWidth: 1))
            .contentShape(Rectangle())
        }
        .buttonStyle(PressStyle())
    }
}

/// Small bordered tag chip (FREE, ELITE, QUESTION, ...).
struct Chip: View {
    let text: String
    var inverted: Bool = false

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 9, weight: .black, design: .monospaced))
            .tracking(1.4)
            .foregroundStyle(inverted ? Color.black : Color.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 5)
            .background(inverted ? Color.white : Color.clear)
            .overlay(Rectangle().strokeBorder(inverted ? Color.clear : Ink.hairline, lineWidth: 1))
    }
}

/// Section header with a title and a trailing hint.
struct SectionHeader: View {
    let title: String
    var trailing: String?
    var rule: Bool = true

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            Display(text: title, size: 20)
            if rule {
                Rectangle().fill(Ink.hairline).frame(height: 1)
            } else {
                Spacer(minLength: 0)
            }
            if let trailing {
                MonoLabel(text: trailing, size: 9, color: Ink.faint)
            }
        }
    }
}

/// Thin animated progress rule.
struct ProgressRule: View {
    let value: Double

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Rectangle().fill(Ink.raised)
                Rectangle()
                    .fill(Color.white)
                    .frame(width: max(0, min(1, value)) * geo.size.width)
            }
        }
        .frame(height: 3)
        .animation(.spring(response: 0.6, dampingFraction: 0.85), value: value)
    }
}

/// Image container that respects the Color-anchor + overlay layout rule.
struct MediaBox: View {
    let ref: PhotoRef?
    var height: CGFloat
    var dim: Double = 0

    var body: some View {
        Color(white: 0.09)
            .frame(height: height)
            .frame(maxWidth: .infinity)
            .overlay {
                if let image = ref?.uiImage {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .grayscale(1)
                        .allowsHitTesting(false)
                } else {
                    Image(systemName: "square.grid.3x3")
                        .font(.system(size: 22, weight: .thin))
                        .foregroundStyle(Ink.faint)
                        .allowsHitTesting(false)
                }
            }
            .overlay { Color.black.opacity(dim).allowsHitTesting(false) }
            .clipped()
    }
}

enum Haptics {
    static func tap() {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.7)
    }

    static func soft() {
        UIImpactFeedbackGenerator(style: .soft).impactOccurred(intensity: 0.5)
    }

    static func success() {
        UINotificationFeedbackGenerator().notificationOccurred(.success)
    }
}
