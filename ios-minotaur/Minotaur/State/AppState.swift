import Foundation
import Observation

/// Persisted slice of the app.
nonisolated struct StateSnapshot: Codable {
    var memberships: [Membership]
    var posts: [Post]
    var messages: [DirectMessage]
    var ownedLabyrinths: [Labyrinth]
    var dmSettings: [String: Bool]
}

/// Single source of truth for the whole MVP.
@Observable
final class AppState {
    private(set) var user: UserProfile = SampleData.user
    var labyrinths: [Labyrinth] = SampleData.labyrinths
    var memberships: [Membership] = []
    var posts: [Post] = SampleData.seedPosts()
    var messages: [DirectMessage] = SampleData.seedMessages()

    /// Set when a member joins and still owes a baseline capture.
    var baselinePrompt: Labyrinth?

    private let storeURL: URL = {
        let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return dir.appendingPathComponent("minotaur-state.json")
    }()

    init() {
        seedIfNeeded()
        load()
    }

    // MARK: - Derived

    var joined: [Labyrinth] {
        memberships
            .sorted { $0.joinedAt > $1.joinedAt }
            .compactMap { membership in labyrinths.first { $0.id == membership.labyrinthID } }
    }

    var owned: [Labyrinth] {
        labyrinths.filter { $0.ownerHandle == user.handle }
    }

    var activeLabyrinth: Labyrinth? { joined.first }

    func isOwner(of labyrinth: Labyrinth) -> Bool { labyrinth.ownerHandle == user.handle }

    func isMember(of labyrinth: Labyrinth) -> Bool {
        memberships.contains { $0.labyrinthID == labyrinth.id }
    }

    func membership(for labyrinth: Labyrinth) -> Membership? {
        memberships.first { $0.labyrinthID == labyrinth.id }
    }

    func today(in labyrinth: Labyrinth) -> ProgramDay? {
        guard let membership = membership(for: labyrinth) else { return labyrinth.days.first }
        let index = min(max(0, membership.currentDay - 1), max(0, labyrinth.days.count - 1))
        return labyrinth.days.indices.contains(index) ? labyrinth.days[index] : nil
    }

    func previousDay(in labyrinth: Labyrinth) -> ProgramDay? {
        guard let membership = membership(for: labyrinth), membership.currentDay > 1 else { return nil }
        let index = membership.currentDay - 2
        return labyrinth.days.indices.contains(index) ? labyrinth.days[index] : nil
    }

    func progress(in labyrinth: Labyrinth) -> Double {
        guard let membership = membership(for: labyrinth), labyrinth.totalDays > 0 else { return 0 }
        return Double(membership.completedDays.count) / Double(labyrinth.totalDays)
    }

    func isComplete(_ labyrinth: Labyrinth) -> Bool {
        guard let membership = membership(for: labyrinth) else { return false }
        return membership.completedDays.count >= labyrinth.totalDays && labyrinth.totalDays > 0
    }

    func posts(in labyrinth: Labyrinth) -> [Post] {
        posts
            .filter { $0.labyrinthID == labyrinth.id }
            .sorted { lhs, rhs in
                if lhs.pinned != rhs.pinned { return lhs.pinned }
                return lhs.createdAt > rhs.createdAt
            }
    }

    func thread(for labyrinth: Labyrinth) -> [DirectMessage] {
        messages.filter { $0.labyrinthID == labyrinth.id }.sorted { $0.sentAt < $1.sentAt }
    }

    /// Progress photos this user has published, newest first.
    var progressGallery: [PhotoRef] {
        posts
            .filter { $0.authorName == user.name }
            .sorted { $0.createdAt > $1.createdAt }
            .compactMap { $0.pair?.current ?? $0.photo }
    }

    // MARK: - Mutations

    func join(_ labyrinth: Labyrinth) {
        guard !isMember(of: labyrinth) else { return }
        memberships.append(Membership(labyrinthID: labyrinth.id,
                                      joinedAt: Date(),
                                      currentDay: 1,
                                      completedDays: [],
                                      baseline: nil))
        baselinePrompt = labyrinth
        save()
    }

    func leave(_ labyrinth: Labyrinth) {
        memberships.removeAll { $0.labyrinthID == labyrinth.id }
        save()
    }

    func setBaseline(_ photo: PhotoRef?, for labyrinth: Labyrinth) {
        guard let index = memberships.firstIndex(where: { $0.labyrinthID == labyrinth.id }) else { return }
        memberships[index].baseline = photo
        save()
    }

    func completeDay(_ day: ProgramDay, in labyrinth: Labyrinth, duration: Int, volume: Int) {
        guard let index = memberships.firstIndex(where: { $0.labyrinthID == labyrinth.id }) else { return }
        memberships[index].completedDays.insert(day.number)
        memberships[index].lastDuration = duration
        memberships[index].lastVolume = volume
        if memberships[index].currentDay == day.number {
            memberships[index].currentDay = min(labyrinth.totalDays, day.number + 1)
        }
        save()
    }

    func addPost(to labyrinth: Labyrinth, text: String, tag: PostTag, photo: PhotoRef?, sharePublicly: Bool) {
        var pair: ProgressPair?
        if sharePublicly, let photo, let baseline = membership(for: labyrinth)?.baseline {
            pair = ProgressPair(baseline: baseline, current: photo, daysIn: membership(for: labyrinth)?.daysIn ?? 1)
        }
        let post = Post(labyrinthID: labyrinth.id,
                        authorName: user.name,
                        authorAvatar: user.avatar,
                        isFounder: isOwner(of: labyrinth),
                        createdAt: Date(),
                        text: text,
                        tag: pair != nil ? .progress : tag,
                        photo: pair == nil ? photo : nil,
                        pair: pair,
                        likes: 0,
                        likedByMe: false,
                        commentCount: 0,
                        pinned: false)
        posts.append(post)
        save()
    }

    func toggleLike(_ post: Post) {
        guard let index = posts.firstIndex(where: { $0.id == post.id }) else { return }
        posts[index].likedByMe.toggle()
        posts[index].likes += posts[index].likedByMe ? 1 : -1
        save()
    }

    func togglePin(_ post: Post) {
        guard let index = posts.firstIndex(where: { $0.id == post.id }) else { return }
        let newValue = !posts[index].pinned
        if newValue {
            for other in posts.indices where posts[other].labyrinthID == post.labyrinthID {
                posts[other].pinned = false
            }
        }
        posts[index].pinned = newValue
        save()
    }

    func send(_ text: String, in labyrinth: Labyrinth) {
        messages.append(DirectMessage(labyrinthID: labyrinth.id, text: text, fromMe: true, sentAt: Date()))
        save()
    }

    func setDM(_ enabled: Bool, for labyrinth: Labyrinth) {
        guard let index = labyrinths.firstIndex(where: { $0.id == labyrinth.id }) else { return }
        labyrinths[index].dmEnabled = enabled
        save()
    }

    func createLabyrinth(name: String, tagline: String, weeks: Int, daysPerWeek: Int, isPublic: Bool, price: Double?) -> Labyrinth {
        let labyrinth = Labyrinth(
            name: name.isEmpty ? "Untitled Labyrinth" : name,
            ownerName: user.name,
            ownerHandle: user.handle,
            ownerAvatar: user.avatar,
            tagline: tagline.isEmpty ? "A new path through the dark." : tagline,
            cover: .asset("basement_gym_squat_rack"),
            weeks: weeks,
            daysPerWeek: daysPerWeek,
            level: "Open",
            category: "Custom",
            price: price,
            memberCount: 0,
            official: false,
            isPublic: isPublic,
            dmEnabled: true,
            days: SampleData.genericDays(daysPerWeek * 2, focus: ["Push", "Pull", "Legs", "Full Body"])
        )
        labyrinths.insert(labyrinth, at: 0)
        save()
        return labyrinth
    }

    // MARK: - Persistence

    private func seedIfNeeded() {
        guard !FileManager.default.fileExists(atPath: storeURL.path) else { return }
        memberships = [Membership(labyrinthID: SampleData.nightwing.id,
                                  joinedAt: Date().addingTimeInterval(-60 * 60 * 24 * 42),
                                  currentDay: 3,
                                  completedDays: [1, 2],
                                  baseline: .asset("man_fitness_before_photo"),
                                  lastVolume: 14_500,
                                  lastDuration: 58)]
        save()
    }

    private func load() {
        guard let data = try? Data(contentsOf: storeURL),
              let snapshot = try? JSONDecoder().decode(StateSnapshot.self, from: data) else { return }
        memberships = snapshot.memberships
        posts = snapshot.posts
        messages = snapshot.messages
        for owned in snapshot.ownedLabyrinths where !labyrinths.contains(where: { $0.id == owned.id }) {
            labyrinths.insert(owned, at: 0)
        }
        for (key, value) in snapshot.dmSettings {
            guard let id = UUID(uuidString: key),
                  let index = labyrinths.firstIndex(where: { $0.id == id }) else { continue }
            labyrinths[index].dmEnabled = value
        }
    }

    private func save() {
        let snapshot = StateSnapshot(
            memberships: memberships,
            posts: posts,
            messages: messages,
            ownedLabyrinths: labyrinths.filter { candidate in
                candidate.ownerHandle == user.handle && !SampleData.labyrinths.contains(where: { $0.id == candidate.id })
            },
            dmSettings: Dictionary(uniqueKeysWithValues: labyrinths.map { ($0.id.uuidString, $0.dmEnabled) })
        )
        guard let data = try? JSONEncoder().encode(snapshot) else { return }
        try? data.write(to: storeURL, options: .atomic)
    }
}
