// 小米 MiMo TTS API 封装
// 提供简洁的调用接口

class MiMoTTS {
    constructor(apiKey, baseUrl = 'https://api.xiaomimimo.com') {
        this.apiKey = apiKey
        this.baseUrl = baseUrl
    }

    // 简化接口 - 类似阿里云格式
    synthesize(params) {
        const {
            text,
            voice = '冰糖',
            format = 'wav',
            model = 'mimo-v2.5-tts',
            style = ''  // 可选：风格指令
        } = params

        // 构建 user message
        let userContent = '请朗读以下文本'
        if (style) {
            userContent += `，用${style}的语气`
        }

        // 转换为 Chat Completions 格式
        const requestBody = {
            model: model,
            messages: [
                { role: 'user', content: userContent },
                { role: 'assistant', content: text }
            ],
            audio: {
                voice: voice,
                format: format
            },
            stream: false
        }

        return this._callAPI(requestBody)
    }

    // 高级接口 - 完全控制 messages
    chatTTS(messages, options = {}) {
        const requestBody = {
            model: options.model || 'mimo-v2.5-tts',
            messages: messages,
            audio: {
                voice: options.voice || '冰糖',
                format: options.format || 'wav'
            },
            stream: options.stream || false
        }

        return this._callAPI(requestBody)
    }

    // 内部 API 调用
    _callAPI(requestBody) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        }

        // 这里应该返回 Promise，实际实现需要根据环境调整
        // fetch(this.baseUrl + '/v1/chat/completions', {
        //     method: 'POST',
        //     headers: headers,
        //     body: JSON.stringify(requestBody)
        // })
        // .then(response => response.json())
        // .then(data => data.choices[0].message.audio.data)

        return {
            url: `${this.baseUrl}/v1/chat/completions`,
            method: 'POST',
            headers: headers,
            body: requestBody
        }
    }
}

// 使用示例
function example1_simple() {
    const tts = new MiMoTTS('your-api-key')

    // 类似阿里云的简洁调用
    const result = tts.synthesize({
        text: '你好世界，这是一个测试',
        voice: '冰糖',
        format: 'wav',
        style: '温柔'
    })

    console.log(result)
}

function example2_advanced() {
    const tts = new MiMoTTS('your-api-key')

    // 高级调用 - 完全控制
    const result = tts.chatTTS(
        [
            { role: 'user', content: '用新闻主播的语气朗读' },
            { role: 'assistant', content: '今天天气晴朗，适合出门。' }
        ],
        {
            voice: '白桦',
            model: 'mimo-v2.5-tts'
        }
    )

    console.log(result)
}

// 对比格式
console.log(`
=== 格式对比 ===

【阿里云 TTS 格式】
{
    "appkey": "xxx",
    "text": "你好世界",
    "format": "mp3",
    "volume": 100,
    "speech_rate": 0
}

【小米 MiMo TTS 格式】
{
    "model": "mimo-v2.5-tts",
    "messages": [
        {"role": "user", "content": "请朗读以下文本"},
        {"role": "assistant", "content": "你好世界"}
    ],
    "audio": {"voice": "冰糖", "format": "wav"},
    "stream": false
}

【封装后的简化调用】
tts.synthesize({
    text: "你好世界",
    voice: "冰糖",
    format: "wav",
    style: "温柔"
})
`)

module.exports = MiMoTTS
