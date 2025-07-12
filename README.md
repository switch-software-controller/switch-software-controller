# Switch Software Controller

Nintendo Switch/Nintendo Switch 2(以下Switch)の自動化を行うためのツールです。
また、このプロダクトは開発中のもので、以下で説明している機能の実装はまだ完了していません。

## Features

### Switchのゲーム画面をキャプチャ

- Switchのゲーム画面をリアルタイムでキャプチャできます。
- キャプチャした画像はOCR(Optical Character Recognition)で解析し、テキスト情報を取得できます。
- キャプチャした画像はTemplate Matchingで解析し、特定の画像を検出できます。
- ゲーム画面のスクリーンショットを取得し、画像ファイルとして保存できます。

### ゲーム操作の自動化

- Switchのゲーム操作を自動化するためのAPIを提供します。
- APIを使用して、ゲームの操作をスクリプトをマクロとして記述できます。
- 解析したテキスト情報や検出した画像を使用して、ゲームの状態に応じた操作を行えます。
- APIはTypeScriptで提供されており、型安全なコードを書くことができます。

### Gamepadとの連携

- Gamepadの入力を取得し、Switchのゲームを操作することができます。
- Gamepadの入力を記録して、マクロとして保存することができます。

## マクロの自作

マクロの自作には`@swicth-software-controller/macro-api`と`@switch-software-controller/controller-api`パッケージを使用します。

### 開発環境のセットアップ

```bash
$ mkdir my-macro
$ cd my-macro
$ npm init -y
$ npm install @switch-software-controller/macro-api @switch-software-controller/controller-api
```

### 実装例

```typescript
import { BaseMacro } from '@switch-software-controller/macro-api';
import { Button, StickTiltPreset } from '@switch-software-controller/controller-api';

class MyMacro extends BaseMacro {
  async process() {
    // マクロの実行内容をここに記述します。
    // 例: 0.5秒間 Aボタンを押す
    await this.pressA(500);

    // 例: 1秒待機
    await this.wait(1000);

    // 例: 複雑な操作を行う
    // 5秒間 AボタンとBボタンを押し、左スティックを右に傾ける
    this.controller.send((state) => {
      state.buttons.press([Button.A, Button.B]);
      state.lStick.tiltPreset(StickTiltPreset.Right);
    });
    await this.wait(5000);
    await this.reset();
  }
}
```

## リポジトリの構造

- リポジトリはモノレポ構成になっており、各機能は独立したパッケージとして管理されています。

### apps

- `apps/switch-software-controller`: Switch Software Controllerのアプリケーションです。

### packages

Switch Software Controllerは以下のパッケージを利用しています。

- `packages/controller`: Gamepadの入力を取得し、Switchのゲームを操作するためのパッケージです。
- `packages/controller-api`:　`packages/controller`のAPIを定義しているパッケージです。
- `packages/logger-api`: ログ出力のためのAPIを提供するパッケージです。
- `packages/macro`: ゲーム操作を自動化するためのマクロを定義するパッケージです。
- `packages/macro-api`: `packages/macro`のAPIを定義しているパッケージです。
- `packages/path-utils`: パス操作のユーティリティを提供するパッケージです。
- `packages/serial-port-api`: シリアルポート通信のためのAPIを提供するパッケージです。
- `packages/stopwatch`: ストップウォッチ機能を提供するパッケージです。
- `packages/stopwatch-api`: `packages/stopwatch`のAPIを定義しているパッケージです。
- `packages/timeline-api`: タイムライン機能を提供するパッケージです。

## Architecture

Poke-Controllerと同様のアーキテクチャを採用しています。
詳しくはコミュニティのドキュメント[機材の準備・購入](https://pokecontroller.info/preparation)を参照してください。
