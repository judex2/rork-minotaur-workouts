import Combine
import SwiftUI

/// Full-screen live session: total timer, set tracking, rest countdown.
struct ActiveWorkoutView: View {
    @Environment(AppState.self) private var state
    @Environment(\.dismiss) private var dismiss

    let labyrinth: Labyrinth
    let day: ProgramDay

    @State private var elapsed: Int = 0
    @State private var running = true
    @State private var completedSets: [UUID: Int] = [:]
    @State private var restRemaining: Int = 0
    @State private var showShare = false

    private let ticker = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    private var totalSets: Int { day.blocks.reduce(0) { $0 + $1.sets } }
    private var doneSets: Int { completedSets.values.reduce(0, +) }
    private var sessionProgress: Double { totalSets == 0 ? 1 : Double(doneSets) / Double(totalSets) }

    var body: some View {
        ZStack(alignment: .bottom) {
            Ink.canvas.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    notes
                    media
                    timer
                    blocks
                    Color.clear.frame(height: 110)
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
            }
            .scrollIndicators(.hidden)
            .safeAreaInset(edge: .top, spacing: 0) { header }

            finishBar
        }
        .overlay(alignment: .top) {
            if restRemaining > 0 { restPill }
        }
        .onReceive(ticker) { _ in
            guard running else { return }
            elapsed += 1
            if restRemaining > 0 {
                restRemaining -= 1
                if restRemaining == 0 { Haptics.success() }
            }
        }
        .sheet(isPresented: $showShare) {
            ComposePostView(labyrinth: labyrinth, prefill: "Day \(day.number) complete — \(day.title).")
                .environment(state)
                .presentationBackground(Ink.canvas)
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 10) {
                    MonoLabel(text: day.header, size: 11, color: Ink.muted)
                    Display(text: labyrinth.name, size: 27)
                }
                Spacer()
                Button {
                    Haptics.soft()
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundStyle(Ink.muted)
                        .frame(width: 44, height: 44)
                        .contentShape(Rectangle())
                }
            }

            HStack {
                MonoLabel(text: "Day \(day.number) of \(labyrinth.totalDays)", size: 12, color: Ink.muted)
                Spacer()
                Text("\(Int(sessionProgress * 100))%")
                    .font(.system(size: 15, weight: .black, design: .monospaced))
                    .foregroundStyle(.white)
                    .contentTransition(.numericText())
            }
            ProgressRule(value: sessionProgress)
        }
        .padding(.horizontal, 20)
        .padding(.top, 8)
        .padding(.bottom, 18)
        .background(Color.black)
        .overlay(alignment: .bottom) { Rectangle().fill(Ink.hairline).frame(height: 1) }
    }

    private var notes: some View {
        Panel(padding: 18) {
            VStack(alignment: .leading, spacing: 12) {
                MonoLabel(text: "Session notes", size: 10, color: Ink.muted, icon: "info.circle")
                Text(day.notes.uppercased())
                    .font(.system(size: 16, weight: .semibold))
                    .tracking(0.6)
                    .foregroundStyle(.white)
                    .lineSpacing(5)
            }
        }
    }

    private var media: some View {
        Panel(padding: 18) {
            VStack(alignment: .leading, spacing: 14) {
                MonoLabel(text: "\(day.title) form check", size: 10, color: Ink.muted, icon: "video")
                MediaBox(ref: labyrinth.cover, height: 180, dim: 0.25)
                    .overlay {
                        Image(systemName: "play.fill")
                            .font(.system(size: 30))
                            .foregroundStyle(.white)
                            .allowsHitTesting(false)
                    }
                    .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
            }
        }
    }

    private var timer: some View {
        Panel(padding: 18) {
            VStack(alignment: .leading, spacing: 12) {
                MonoLabel(text: "Total workout time", size: 10, color: Ink.muted, icon: "clock")
                Text(clock(elapsed))
                    .font(.system(size: 52, weight: .black, design: .monospaced))
                    .foregroundStyle(.white)
                    .contentTransition(.numericText())
                    .minimumScaleFactor(0.6)
                    .lineLimit(1)
                HStack(spacing: 10) {
                    SlabButton(title: running ? "Pause" : "Resume", filled: false, height: 42) {
                        withAnimation { running.toggle() }
                    }
                    SlabButton(title: "Reset", filled: false, height: 42) {
                        elapsed = 0
                    }
                }
            }
        }
    }

    private var blocks: some View {
        VStack(alignment: .leading, spacing: 12) {
            MonoLabel(text: "Exercise blocks", size: 10, color: Ink.muted, icon: "square.stack.3d.up")
            if day.blocks.isEmpty {
                Panel {
                    Text("Recovery day. Move, breathe, then close the session.")
                        .font(.system(size: 14))
                        .foregroundStyle(Ink.muted)
                }
            }
            ForEach(Array(day.blocks.enumerated()), id: \.element.id) { index, block in
                blockCard(index: index, block: block)
            }
        }
    }

    private func blockCard(index: Int, block: ExerciseBlock) -> some View {
        let done = completedSets[block.id] ?? 0
        return Panel(padding: 16) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Chip(text: "Block \(blockLetter(index))")
                    Spacer()
                    MonoLabel(text: "\(done)/\(block.sets) sets", size: 9, color: done == block.sets ? .white : Ink.faint)
                }
                Display(text: block.name, size: 18)

                HStack(spacing: 0) {
                    metric("Sets", "\(block.sets)")
                    metric("Reps", block.reps)
                    metric("Rest", "\(block.restSeconds)s")
                }

                if let note = block.note {
                    Text(note)
                        .font(.system(size: 12))
                        .foregroundStyle(Ink.faint)
                }

                HStack(spacing: 6) {
                    ForEach(0..<block.sets, id: \.self) { setIndex in
                        Button {
                            Haptics.tap()
                            let newValue = setIndex < done ? setIndex : setIndex + 1
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                completedSets[block.id] = newValue
                            }
                            if newValue > done { restRemaining = block.restSeconds }
                        } label: {
                            Rectangle()
                                .fill(setIndex < done ? Color.white : Color.clear)
                                .overlay(Rectangle().strokeBorder(Ink.hairline, lineWidth: 1))
                                .frame(height: 38)
                                .overlay {
                                    Text("\(setIndex + 1)")
                                        .font(.system(size: 12, weight: .black, design: .monospaced))
                                        .foregroundStyle(setIndex < done ? .black : Ink.muted)
                                }
                        }
                        .buttonStyle(PressStyle())
                    }
                }
            }
        }
    }

    private func metric(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            MonoLabel(text: label, size: 8, color: Ink.faint)
            Text(value)
                .font(.system(size: 15, weight: .bold, design: .monospaced))
                .foregroundStyle(.white)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var restPill: some View {
        HStack(spacing: 10) {
            Image(systemName: "hourglass")
                .font(.system(size: 12, weight: .bold))
            Text("REST \(clockShort(restRemaining))")
                .font(.system(size: 12, weight: .black, design: .monospaced))
                .tracking(1.4)
        }
        .foregroundStyle(.black)
        .padding(.horizontal, 16)
        .frame(height: 38)
        .background(Color.white)
        .padding(.top, 6)
        .transition(.move(edge: .top).combined(with: .opacity))
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: restRemaining > 0)
    }

    private var finishBar: some View {
        VStack(spacing: 0) {
            Rectangle().fill(Ink.hairline).frame(height: 1)
            SlabButton(title: "Finish Labyrinth", height: 58) {
                let volume = day.blocks.reduce(0) { $0 + $1.sets * 250 }
                state.completeDay(day, in: labyrinth, duration: max(1, elapsed / 60), volume: volume)
                Haptics.success()
                showShare = true
            }
            .padding(16)
        }
        .background(Color.black)
    }

    private func blockLetter(_ index: Int) -> String {
        let letters = Array("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        return String(letters[index % letters.count])
    }

    private func clock(_ seconds: Int) -> String {
        String(format: "%02d:%02d:%02d", seconds / 3_600, (seconds % 3_600) / 60, seconds % 60)
    }

    private func clockShort(_ seconds: Int) -> String {
        String(format: "%02d:%02d", seconds / 60, seconds % 60)
    }
}
