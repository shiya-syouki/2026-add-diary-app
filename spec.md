# 日記アプリ 仕様書

> 最終更新: 2026-06-11（D1–D3 確定）  
> 実装計画: [`docs/tasks.md`](docs/tasks.md)

---

## 1. 概要

| 項目 | 内容 |
| --- | --- |
| アプリ名 | 日記アプリ (diary-app) |
| 目的 | 日々の出来事を気分・タイトル・本文で記録するモバイル日記 |
| 対象 | ハンズオン受講生（個人利用） |
| 実行環境 | Expo Go（Expo SDK 54） |

---

## 2. 技術スタック

- React Native / Expo Router / TypeScript
- Firebase JS SDK (`firebase` パッケージ) — Expo Go 対応のため `@react-native-firebase/*` は使わない
- 状態管理: React Context（必要に応じてリポジトリ層を追加）
- 品質: `just check` / `just test`

---

## 3. 認証

### 3.1 方式（確定）

**メールアドレス + パスワード**（Firebase Authentication）

| 機能 | 対応 |
| --- | --- |
| サインアップ | ✅ |
| ログイン | ✅ |
| ログアウト | ✅ |
| パスワードリセット | ✅（メール送信） |

### 3.2 フロー

1. 未ログイン → ログイン画面を表示（保護ルート）
2. 新規ユーザー → サインアップ画面からアカウント作成
3. ログイン成功 → 日記一覧（`/`）へ遷移
4. ログアウト → ログイン画面へ戻る

### 3.3 データの分離

- 日記エントリはログイン中ユーザーの `uid` に紐づける
- 他ユーザーのデータは読み書き不可（Firestore セキュリティルールで強制）

---

## 4. データモデル

### 4.1 Entry（アプリ内）

```ts
type Entry = {
  id: string;
  date: Date;       // 作成日時（表示・ソート用）
  mood: string;     // 絵文字 1 つ
  title: string;
  body: string;
};
```

### 4.2 エントリのルール（確定）

- **1 日あたりの件数に制限はない**（同日に複数エントリを作成できる）
- ソートは `date`（作成日時）の降順（新しいものが上）
- 「今日の記録」カードは当日の**最新 1 件**をプレビュー表示する（複数ある場合）

### 4.3 Firestore（確定）

**コレクション構造**: `users/{uid}/entries/{entryId}`

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `mood` | string | 気分（絵文字） |
| `title` | string | タイトル |
| `body` | string | 本文 |
| `createdAt` | Timestamp | 作成日時（ソート・表示用） |
| `updatedAt` | Timestamp | 最終更新日時 |

- ドキュメント ID（`entryId`）は Firestore の自動生成 ID を使用する
- アプリ内の `Entry.id` はこの `entryId` と一致させる
- アプリ内の `Entry.date` は `createdAt` から変換する

**セキュリティルール（方針）**:

```
users/{uid}/entries/{entryId}
  → request.auth != null かつ request.auth.uid == uid の場合のみ read/write 可
```

---

## 5. 画面一覧

| 画面 | ルート | 状態 |
| --- | --- | --- |
| 日記一覧 | `/` | ✅ 実装済 |
| 新規作成 | `/new` | ✅ 実装済 |
| 詳細 | `/entry/[id]` | 未実装 |
| 編集 | `/entry/[id]/edit` | 未実装 |
| ログイン | `/login` | 未実装 |
| サインアップ | `/signup` | 未実装 |

---

## 6. 未確定事項

| # | 論点 | 状態 |
| --- | --- | --- |
| D1 | 認証方式 | ✅ メール + パスワード |
| D2 | 1 日 1 件制限 | ✅ なし（複数エントリ可） |
| D3 | Firestore コレクション構造 | ✅ `users/{uid}/entries/{entryId}` |
| D4 | オフライン対応 | 未確定 |
| D5 | ローカル永続化（AsyncStorage） | 未確定 |
| D6 | 詳細画面の遷移 | 未確定 |
| D7 | Firebase 設定の渡し方 | 未確定 |
| D8 | シードデータの扱い | 未確定 |

---

## 7. スコープ外（初版）

- ソーシャル共有・公開日記
- 画像添付
- プッシュ通知
- `@react-native-firebase/*` ベースのネイティブ Firebase
