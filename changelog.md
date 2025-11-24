# Changelog

All notable changes to the **LuxeQR** project will be documented in this file.

## [Unreleased] - 2024-05-23 (Current)
### Added
- **Custom QR Rendering Engine:** Replaced standard library with a custom HTML5 Canvas engine.
- **Dot Scale Control:** Users can now adjust the size of QR modules (dots) from 20% to 100% to create "thinner" or "airier" codes.
- **Dot Style:** Added option for 'Circle' vs 'Square' dots.
- **True Background Support:** Logos can now be drawn behind the QR code data modules.
- **Physical Scan Calculator:** Added deep research feature to calculate scan distance based on print size.

### Changed
- **UI Overhaul:** Complete redesign of the editor with a segmented control layout and dark luxury theme.
- **Pre-flight Check:** Improved logic to handle new dot scaling risks.

## [0.2.0] - 2024-05-22
### Added
- **Pre-flight Tab:** Automatic contrast and density analysis.
- **Physical Range Calculator:** Tool to estimate max scanning distance.
- **Gradient Support:** Custom start/end color pickers for gradients.

### Fixed
- Fixed issue where gradients weren't applying correctly to high-res downloads.

## [0.1.0] - 2024-05-21
### Added
- Initial release of LuxeQR.
- Basic QR generation with URL and WiFi modes.
- AI Tagline generator integration (Gemini).
- Frame styles (Acrylic, Polaroid, ScanMe).
- High-resolution download logic.
