# Switch Software Controller

[![Node.js CI](https://github.com/switch-software-controller/switch-software-controller/actions/workflows/nodejs-ci.yml/badge.svg?branch=main)](https://github.com/switch-software-controller/switch-software-controller/actions/workflows/nodejs-ci.yml)

A tool for automating Nintendo Switch/Nintendo Switch 2 (hereafter referred to as Switch).
Note that this product is under development, and the features described below are not yet fully implemented.

## Features

### Switch Game Screen Capture

- Real-time capture of Switch game screens.
- Captured images can be analyzed using OCR (Optical Character Recognition) to extract text information.
- Captured images can be analyzed using Template Matching to detect specific images.
- Screenshots of the game screen can be taken and saved as image files.

### Game Operation Automation

- Provides APIs for automating Switch game operations.
- Using the API, game operations can be written as macros.
- Operations can be performed based on game state using analyzed text information and detected images.
- The API is provided in TypeScript, allowing for type-safe code.

### Gamepad Integration

- Gamepad input can be captured to control Switch games.
- Gamepad input can be recorded and saved as macros.

## Creating Custom Macros

Custom macros use the `@switch-software-controller/macro-api` and `@switch-software-controller/controller-api` packages.

### Development Environment Setup

```bash
$ mkdir my-macro
$ cd my-macro
$ npm init -y
$ npm install @switch-software-controller/macro-api @switch-software-controller/controller-api
```

### Implementation Example

```typescript
import { BaseMacro } from '@switch-software-controller/macro-api';
import { Button, StickTiltPreset } from '@switch-software-controller/controller-api';

class MyMacro extends BaseMacro {
  async process() {
    // Write macro execution content here.
    // Example: Press A button for 0.5 seconds
    await this.pressA(500);

    // Example: Wait for 1 second
    await this.wait(1000);

    // Example: Perform complex operations
    // Press A and B buttons for 5 seconds while tilting left stick to the right
    this.controller.send((state) => {
      state.buttons.press([Button.A, Button.B]);
      state.lStick.tiltPreset(StickTiltPreset.Right);
    });
    await this.wait(5000);
    await this.reset();
  }
}
```

## Repository Structure

- The repository is configured as a monorepo, with each feature managed as an independent package.

### apps

- `apps/switch-software-controller`: The Switch Software Controller application.

### packages

Switch Software Controller uses the following packages:

- `packages/controller`: Package for capturing gamepad input and controlling Switch games.
- `packages/controller-api`: Package defining the API for `packages/controller`.
- `packages/logger-api`: Package providing API for log output.
- `packages/macro`: Package defining macros for automating game operations.
- `packages/macro-api`: Package defining the API for `packages/macro`.
- `packages/path-utils`: Package providing path manipulation utilities.
- `packages/serial-port-api`: Package providing API for serial port communication.
- `packages/stopwatch`: Package providing stopwatch functionality.
- `packages/stopwatch-api`: Package defining the API for `packages/stopwatch`.
- `packages/timeline-api`: Package providing timeline functionality.

## Architecture

Adopts an architecture similar to Poke-Controller.
For details, refer to the community documentation [Equipment Preparation and Purchase](https://pokecontroller.info/preparation).
