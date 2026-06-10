// 小米 MiMo TTS 语音合成插件
// Xiaomi MiMo TTS Speech Synthesis Plugin
// 请点击保存后在 更多选项按钮(垂直三个点) -> 设置变量 中设置 API Key
// Please set the API Key in "More options" -> "Variables" after clicking save.

let apiKey = ttsrv.userVars['apiKey'] || ''
let baseUrl = ttsrv.userVars['baseUrl'] || 'https://api.xiaomimimo.com'

// 预置音色列表
let PRESET_VOICES = {
    'zh-CN': {
        '冰糖': {name: '冰糖', gender: 'female', description: '温柔甜美的女声'},
        '茉莉': {name: '茉莉', gender: 'female', description: '清新的女声'},
        '苏打': {name: '苏打', gender: 'male', description: '阳光的男声'},
        '白桦': {name: '白桦', gender: 'male', description: '沉稳的男声'},
    },
    'en-US': {
        'Mia': {name: 'Mia', gender: 'female', description: 'English female voice'},
        'Chloe': {name: 'Chloe', gender: 'female', description: 'English female voice'},
        'Milo': {name: 'Milo', gender: 'male', description: 'English male voice'},
        'Dean': {name: 'Dean', gender: 'male', description: 'English male voice'},
    }
}

// 风格标签列表
let STYLE_TAGS = {
    emotion: ['开心', '悲伤', '愤怒', '惊讶', '恐惧', '厌恶', '期待', '信任', '平静', '兴奋', '温柔', '严肃', '幽默', '感动', '思念', '孤独'],
    dialect: ['东北话', '四川话', '河南话', '陕西话', '湖南话', '广东话', '台湾腔'],
    roleplay: ['小女孩', '小男孩', '年轻女性', '年轻男性', '中年女性', '中年男性', '老年女性', '老年男性', '动漫角色', '机器人'],
    other: ['唱歌', '耳语', '快速', '缓慢', '高音', '低音', '清晰', '模糊']
}

let PluginJS = {
    "name": "小米 MiMo TTS",
    "id": "com.xiaomi.mimo.tts",
    "author": "TTS Server",
    "description": "小米 MiMo 语音合成，支持预置音色、风格控制、唱歌等功能",
    "version": 1,
    "vars": {
        apiKey: {label: "API Key", hint: "从 https://platform.xiaomimimo.com 获取"},
        baseUrl: {label: "API 地址", hint: "默认 https://api.xiaomimimo.com，可自定义"},
    },

    "onLoad": function () {
        checkApiKey()
    },

    "getAudio": function (text, locale, voice, rate, volume, pitch) {
        checkApiKey()

        // 获取用户选择的模型和风格
        let model = ttsrv.tts.data['model'] || 'mimo-v2.5-tts'
        let styles = ttsrv.tts.data['styles'] || ''
        let userInstruction = ttsrv.tts.data['userInstruction'] || ''
        let singing = ttsrv.tts.data['singing'] === 'true'

        // 构建系统消息 - 包含风格指令
        let systemContent = '你是一个专业的语音合成助手。'
        if (styles) {
            systemContent += '请用以下风格朗读：' + styles + '。'
        }
        if (userInstruction) {
            systemContent += userInstruction
        }
        if (singing) {
            systemContent += '请以唱歌的方式演绎以下歌词。'
        }

        // 构建请求体 - 符合 OpenAI Chat Completions 格式
        let requestBody = {
            model: model,
            messages: [
                {
                    role: 'system',
                    content: systemContent
                },
                {
                    role: 'assistant',
                    content: text
                }
            ],
            audio: {
                voice: voice || '冰糖',
                format: 'wav'
            },
            stream: false
        }

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        }

        let resp = ttsrv.httpPost(
            baseUrl + '/v1/chat/completions',
            JSON.stringify(requestBody),
            headers
        )

        if (resp.code() !== 200) {
            handleError(resp)
        }

        // 解析响应获取音频数据
        let respText = resp.body().string()
        let respJson = JSON.parse(respText)

        if (respJson.choices && respJson.choices.length > 0) {
            let message = respJson.choices[0].message
            if (message.audio && message.audio.data) {
                // Base64 解码音频数据
                let audioBytes = java.util.Base64.getDecoder().decode(message.audio.data)
                return new java.io.ByteArrayInputStream(audioBytes)
            }
        }

        throw "响应中未找到音频数据"
    },
}

function checkApiKey() {
    apiKey = (apiKey + '').trim()
    if (apiKey === '') {
        throw "请设置变量: API Key。请从 https://platform.xiaomimimo.com 获取"
    }
}

function handleError(resp) {
    let code = resp.code()
    if (code === 401) {
        throw "401 Unauthorized: API Key 无效，请检查设置"
    } else if (code === 403) {
        throw "403 Forbidden: 访问被拒绝，请检查 API Key 权限"
    } else if (code === 429) {
        throw "429 Too Many Requests: 请求过于频繁，请稍后重试"
    } else {
        let body = ''
        try {
            body = resp.body().string()
        } catch (e) {}
        throw "请求失败: HTTP " + code + " " + body
    }
}

// ========== EditorJS ==========
let EditorJS = {
    "getAudioSampleRate": function (locale, voice) {
        return 24000
    },

    "isNeedDecode": function (locale, voice) {
        return false // 返回的已经是解码后的音频
    },

    "getLocales": function () {
        return ['zh-CN', 'en-US']
    },

    "getVoices": function (locale) {
        let voices = PRESET_VOICES[locale] || PRESET_VOICES['zh-CN']
        let result = {}
        for (let key in voices) {
            result[key] = voices[key].name + ' (' + voices[key].gender + ')'
        }
        return result
    },

    "onLoadData": function () {
        // 可以在这里加载更多音色数据
    },

    "onLoadUI": function (ctx, linerLayout) {
        // 模型选择
        let modelSpinner = JSpinner(ctx, "模型 (Model)")
        modelSpinner.items = [
            Item("MiMo TTS v2.5 (预置音色)", "mimo-v2.5-tts"),
            Item("MiMo TTS VoiceDesign (音色设计)", "mimo-v2.5-tts-voicedesign"),
            Item("MiMo TTS VoiceClone (音色克隆)", "mimo-v2.5-tts-voiceclone"),
        ]
        linerLayout.addView(modelSpinner)
        ttsrv.setMargins(modelSpinner, 2, 4, 0, 0)

        let currentModel = ttsrv.tts.data['model'] || 'mimo-v2.5-tts'
        let modelPos = 0
        if (currentModel === 'mimo-v2.5-tts-voicedesign') modelPos = 1
        if (currentModel === 'mimo-v2.5-tts-voiceclone') modelPos = 2
        modelSpinner.selectedPosition = modelPos

        modelSpinner.setOnItemSelected(function (spinner, pos, item) {
            ttsrv.tts.data['model'] = item.value
        })

        // 风格选择
        let styleSpinner = JSpinner(ctx, "风格标签 (Style Tags)")
        let styleItems = [Item("无", "")]
        for (let category in STYLE_TAGS) {
            STYLE_TAGS[category].forEach(function (style) {
                styleItems.push(Item(style, style))
            })
        }
        styleSpinner.items = styleItems
        linerLayout.addView(styleSpinner)
        ttsrv.setMargins(styleSpinner, 2, 4, 0, 0)

        let currentStyle = ttsrv.tts.data['styles'] || ''
        let stylePos = 0
        styleItems.forEach(function (item, i) {
            if (item.value === currentStyle) stylePos = i
        })
        styleSpinner.selectedPosition = stylePos

        styleSpinner.setOnItemSelected(function (spinner, pos, item) {
            ttsrv.tts.data['styles'] = item.value
        })

        // 自然语言指令
        let instructionInput = JTextInput(ctx, "风格指令 (Style Instruction)")
        instructionInput.text = ttsrv.tts.data['userInstruction'] || ''
        linerLayout.addView(instructionInput)
        ttsrv.setMargins(instructionInput, 2, 4, 0, 0)

        instructionInput.addTextChangedListener({
            onChanged: function (s) {
                ttsrv.tts.data['userInstruction'] = s.toString()
            }
        })

        // 唱歌模式
        let singingLayout = new LinearLayout(ctx)
        singingLayout.orientation = LinearLayout.HORIZONTAL
        let singingCheck = new android.widget.CheckBox(ctx)
        singingCheck.text = "唱歌模式 (Singing Mode)"
        singingCheck.checked = ttsrv.tts.data['singing'] === 'true'
        singingCheck.setOnCheckedChangeListener({
            onCheckedChanged: function (buttonView, isChecked) {
                ttsrv.tts.data['singing'] = isChecked ? 'true' : 'false'
            }
        })
        singingLayout.addView(singingCheck)
        linerLayout.addView(singingLayout)
        ttsrv.setMargins(singingLayout, 2, 4, 0, 0)
    },

    "onVoiceChanged": function (locale, voice) {
        // 音色变更时的处理
    }
}
