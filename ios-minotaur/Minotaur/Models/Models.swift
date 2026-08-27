import Foundation
import UIKit

/// A photo that either lives in the asset catalog or was captured by the user.
nonisolated enum PhotoRef: Codable, Hashable {
    case asset(String)
    case data(Data)

    var uiImage: UIImage? {
        switch self {
        case .asset(let name): return UIImage(named: name)
        case .data(let data): return UIImage(data: data)
        }
    }
}

nonisolated struct ExerciseBlock: Codable, Hashable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var target: String
    var sets: Int
    var reps: String
    var restSeconds: Int
    var note: String?
}

nonisolated struct ProgramDay: Codable, Hashable, Identifiable {
    var id: UUID = UUID()
    var number: Int
    var weekday: String
    var title: String
    var notes: String
    var estimatedMinutes: Int
    var blocks: [ExerciseBlock]

    var header: String { "\(weekday) — \(title)" }
    var isRest: Bool { blocks.isEmpty }
}

nonisolated struct Labyrinth: Codable, Hashable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var ownerName: String
    var ownerHandle: String
    var ownerAvatar: PhotoRef?
    var tagline: String
    var cover: PhotoRef?
    var weeks: Int
    var daysPerWeek: Int
    var level: String
    var category: String
    var price: Double?
    var memberCount: Int
    var official: Bool
    var isPublic: Bool
    var dmEnabled: Bool
    var days: [ProgramDay]

    var priceLabel: String { price.map { String(format: "$%.2f", $0) } ?? "FREE" }
    var totalDays: Int { days.count }
}

nonisolated struct Membership: Codable, Hashable {
    var labyrinthID: UUID
    var joinedAt: Date
    var currentDay: Int
    var completedDays: Set<Int>
    var baseline: PhotoRef?
    var lastVolume: Int?
    var lastDuration: Int?

    var daysIn: Int {
        max(1, Calendar.current.dateComponents([.day], from: joinedAt, to: Date()).day ?? 0)
    }
}

nonisolated enum PostTag: String, Codable, Hashable, CaseIterable {
    case update
    case question
    case progress

    var label: String {
        switch self {
        case .update: return "Update"
        case .question: return "Question"
        case .progress: return "Progress"
        }
    }
}

nonisolated struct ProgressPair: Codable, Hashable {
    var baseline: PhotoRef
    var current: PhotoRef
    var daysIn: Int
}

nonisolated struct Post: Codable, Hashable, Identifiable {
    var id: UUID = UUID()
    var labyrinthID: UUID
    var authorName: String
    var authorAvatar: PhotoRef?
    var isFounder: Bool
    var createdAt: Date
    var text: String
    var tag: PostTag
    var photo: PhotoRef?
    var pair: ProgressPair?
    var likes: Int
    var likedByMe: Bool
    var commentCount: Int
    var pinned: Bool
}

nonisolated struct DirectMessage: Codable, Hashable, Identifiable {
    var id: UUID = UUID()
    var labyrinthID: UUID
    var text: String
    var fromMe: Bool
    var sentAt: Date
}

nonisolated struct UserProfile: Codable, Hashable {
    var name: String
    var handle: String
    var tagline: String
    var avatar: PhotoRef?
    var verified: Bool
}

nonisolated extension Date {
    /// Compact relative stamp, e.g. "2H AGO".
    var shortAgo: String {
        let seconds = Int(Date().timeIntervalSince(self))
        if seconds < 60 { return "NOW" }
        if seconds < 3_600 { return "\(seconds / 60)M AGO" }
        if seconds < 86_400 { return "\(seconds / 3_600)H AGO" }
        return "\(seconds / 86_400)D AGO"
    }
}
