# 小米 MiMo TTS 插件使用说明

## 功能特性

- **预置音色合成** - 支持冰糖、茉莉、苏打、白桦等多种中文音色，以及 Mia、Chloe、Milo、Dean 等英文音色
- **风格控制** - 支持情绪、方言、角色扮演等多种风格标签
- **自然语言指令** - 用自然语言描述想要的语音风格
- **唱歌模式** - 支持歌词合成
- **多模型支持** - MiMo TTS v2.5、VoiceDesign（音色设计）、VoiceClone（音色克隆）

## 快速开始

### 1. 获取 API Key

访问 [小米 MiMo 开放平台](https://platform.xiaomimimo.com) 注册并获取 API Key。

### 2. 导入插件

在 TTS Server 应用中：
1. 进入 **设置** -> **插件管理**
2. 点击 **导入插件**
3. 选择 `plugin-mimo-tts-import.json` 文件（注意：必须导入 JSON 格式文件，不是 JS 文件）

**重要**: TTS Server 要求导入 JSON 格式的配置文件，而不是直接的 JavaScript 代码。请使用 `plugin-mimo-tts-import.json` 文件进行导入。

### 3. 配置 API Key

1. 在插件列表中找到 **小米 MiMo TTS**
2. 点击 **更多选项** (垂直三个点)
3. 选择 **设置变量**
4. 填入你的 API Key
5. 点击保存

### 4. 使用插件

1. 在 TTS 设置中选择 **小米 MiMo TTS** 作为语音引擎
2. 选择语言和音色
3. 可选：在编辑界面设置风格、指令等
4. 开始使用

## 音色列表

### 中文音色

| 音色 | 性别 | 特点 |
|------|------|------|
| 冰糖 | 女性 | 温柔甜美 |
| 茉莉 | 女性 | 清新自然 |
| 苏打 | 男性 | 阳光活力 |
| 白桦 | 男性 | 沉稳大气 |

### 英文音色

| 音色 | 性别 |
|------|------|
| Mia | 女性 |
| Chloe | 女性 |
| Milo | 男性 |
| Dean | 男性 |

## 风格控制

### 情绪风格
开心、悲伤、愤怒、惊讶、恐惧、厌恶、期待、信任、平静、兴奋、温柔、严肃、幽默、感动、思念、孤独

### 方言风格
东北话、四川话、河南话、陕西话、湖南话、广东话、台湾腔

### 角色扮演
小女孩、小男孩、年轻女性、年轻男性、中年女性、中年男性、老年女性、老年男性、动漫角色、机器人

### 其他风格
唱歌、耳语、快速、缓慢、高音、低音、清晰、模糊

## 高级用法

### 自然语言指令

在编辑界面的"风格指令"输入框中，可以输入自然语言描述来控制语音风格：

- "用轻快上扬的语调，语速稍快"
- "模仿新闻主播的播报风格"
- "温柔低沉的耳语"
- "充满激情的演讲风格"

### 唱歌模式

勾选"唱歌模式"复选框后，输入歌词即可合成歌声。

### 音色设计 (VoiceDesign)

选择 "MiMo TTS VoiceDesign" 模型后，可以通过文字描述自定义音色：
- "温暖的中年女性声音，语速缓慢"
- "低沉沙哑的男性嗓音，带有一点烟嗓"

### 音色克隆 (VoiceClone)

选择 "MiMo TTS VoiceClone" 模型后，可以上传音频样本克隆音色（需要配合 API 使用）。

## API 信息

- **API 端点**: `https://api.xiaomimimo.com/v1/chat/completions`
- **认证方式**: Bearer Token (API Key)
- **支持格式**: WAV, MP3, PCM, PCM16

## 常见问题

### Q: 提示 "401 Unauthorized"
A: API Key 无效，请检查是否正确填写，或重新从平台获取。

### Q: 提示 "429 Too Many Requests"
A: 请求过于频繁，请稍后重试。MiMo TTS 有速率限制。

### Q: 如何获取更多音色？
A: 访问 [小米 MiMo 平台](https://platform.xiaomimimo.com) 查看完整音色列表。

### Q: 支持流式合成吗？
A: 当前版本使用非流式模式，后续版本将支持流式合成。

## 相关链接

- [小米 MiMo 开放平台](https://platform.xiaomimimo.com)
- [MiMo TTS 官方文档](https://docs.xiaomimimo.com)
- [TTS Server 项目](https://github.com/jing332/tts-server-android)

## 许可证

MIT License
