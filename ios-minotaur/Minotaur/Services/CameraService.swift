import AVFoundation
import SwiftUI
import UIKit

/// Thread-safe holder for the capture objects so they can cross onto the session queue.
nonisolated final class CameraBox: @unchecked Sendable {
    let session = AVCaptureSession()
    let output = AVCapturePhotoOutput()
    let queue = DispatchQueue(label: "com.minotaur.camera.session")
}

/// Minimal AVFoundation still-capture pipeline used for baseline / progress photos.
@Observable
final class CameraService: NSObject {
    enum Status {
        case idle
        case ready
        case denied
        case unavailable
    }

    private(set) var status: Status = .idle
    var captured: UIImage?

    @ObservationIgnored let box = CameraBox()
    @ObservationIgnored private var isConfigured = false

    func start() async {
        let granted = await requestAccess()
        guard granted else {
            status = .denied
            return
        }
        if !isConfigured {
            guard configure() else {
                status = .unavailable
                return
            }
            isConfigured = true
        }
        status = .ready
        let box = self.box
        box.queue.async {
            if !box.session.isRunning { box.session.startRunning() }
        }
    }

    func stop() {
        let box = self.box
        box.queue.async {
            if box.session.isRunning { box.session.stopRunning() }
        }
    }

    func capture() {
        guard status == .ready else { return }
        let settings = AVCapturePhotoSettings()
        box.output.capturePhoto(with: settings, delegate: self)
    }

    private func requestAccess() async -> Bool {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized: return true
        case .notDetermined: return await AVCaptureDevice.requestAccess(for: .video)
        default: return false
        }
    }

    private func configure() -> Bool {
        let types: [AVCaptureDevice.DeviceType] = [
            .builtInWideAngleCamera,
            .builtInDualCamera,
            .external
        ]
        let discovery = AVCaptureDevice.DiscoverySession(deviceTypes: types, mediaType: .video, position: .unspecified)
        let device = discovery.devices.first(where: { $0.position == .front }) ?? discovery.devices.first
        guard let device, let input = try? AVCaptureDeviceInput(device: device) else { return false }

        box.session.beginConfiguration()
        box.session.sessionPreset = .photo
        guard box.session.canAddInput(input), box.session.canAddOutput(box.output) else {
            box.session.commitConfiguration()
            return false
        }
        box.session.addInput(input)
        box.session.addOutput(box.output)
        box.session.commitConfiguration()
        return true
    }
}

extension CameraService: AVCapturePhotoCaptureDelegate {
    nonisolated func photoOutput(_ output: AVCapturePhotoOutput,
                                 didFinishProcessingPhoto photo: AVCapturePhoto,
                                 error: (any Error)?) {
        guard error == nil, let data = photo.fileDataRepresentation(), let image = UIImage(data: data) else { return }
        Task { @MainActor in
            self.captured = image
        }
    }
}

/// Live preview layer for the capture session.
struct CameraPreview: UIViewRepresentable {
    let box: CameraBox

    func makeUIView(context: Context) -> PreviewView {
        let view = PreviewView()
        view.backgroundColor = .black
        view.videoLayer.session = box.session
        view.videoLayer.videoGravity = .resizeAspectFill
        return view
    }

    func updateUIView(_ uiView: PreviewView, context: Context) {}

    final class PreviewView: UIView {
        override class var layerClass: AnyClass { AVCaptureVideoPreviewLayer.self }
        var videoLayer: AVCaptureVideoPreviewLayer {
            guard let layer = layer as? AVCaptureVideoPreviewLayer else {
                return AVCaptureVideoPreviewLayer()
            }
            return layer
        }
    }
}
