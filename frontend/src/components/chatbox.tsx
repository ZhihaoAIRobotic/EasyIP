"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Chat } from '@douyinfe/semi-ui';
import { Message } from '@douyinfe/semi-foundation/lib/es/chat/foundation';

// 扩展Semi UI的Message类型
interface ChatMessage extends Message {
  status?: 'loading' | 'incomplete' | 'complete';
}

const defaultMessage: ChatMessage[] = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 Semi design"
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: `
Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户[[1]](https://semi.design/zh-CN/start/introduction)。

Semi Design的特点包括：

1. 设计简洁、现代化。
2. 提供主题方案，可深度样式定制。
3. 提供明暗色两套模式，切换方便。
4. 国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
5. 采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。

---
Learn more:
1. [Introduction 介绍 - Semi Design](https://semi.design/zh-CN/start/introduction)
2. [Getting Started 快速开始 - Semi Design](https://semi.design/zh-CN/start/getting-started)
3. [Semi D2C 设计稿转代码的演进之路 - 知乎](https://zhuanlan.zhihu.com/p/667189184)
`,
    }
];

const roleInfo = {
    user: {
        name: 'User',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    }
}

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
    height: 600,
}

let id = 0;
function getId() {
    return `id-${id++}`
}
const uploadProps = { action: 'https://api.semi.design/upload' }

function DynamicUpdateChat() {
    const [message, setMessage] = useState<ChatMessage[]>(defaultMessage);
    const intervalId = useRef<NodeJS.Timeout | null>(null);
    
    const onMessageSend = useCallback((content: string, attachment: any) => {
        setMessage((prevMessage) => {
            return [
                ...prevMessage,
                {
                    role: 'assistant',
                    status: 'loading',
                    createAt: Date.now(),
                    id: getId(),
                    content: '',
                }
            ]
        }); 
        generateMockResponse(content);
    }, []);

    // 修改onChatsChange类型
    const onChatsChange = useCallback((chats?: Message[]) => {
        if (chats) {
            setMessage(chats as ChatMessage[]);
        }
    }, []);

    const generateMockResponse = useCallback((content: string) => {
        const id = setInterval(() => {
            setMessage((prevMessage) => {
                const lastMessage = prevMessage[prevMessage.length - 1];
                let newMessage = {...lastMessage};
                if (lastMessage.status === 'loading') {
                    newMessage = {
                        ...newMessage,
                        content:  `mock Response for ${content} \n`,
                        status: 'incomplete'
                    }
                } else if (lastMessage.status === 'incomplete') {
                    if (lastMessage.content && lastMessage.content.length > 200) {
                        clearInterval(id);
                        intervalId.current = null;
                        newMessage = {
                            ...newMessage,
                            content: `${lastMessage.content || ''} mock stream message`,
                            status: 'complete'
                        }
                    } else {
                        newMessage = {
                            ...newMessage,
                            content: `${lastMessage.content || ''} mock stream message`
                        }
                    }  
                }
                return [ ...prevMessage.slice(0, -1), newMessage ]
            })
        }, 400);
        intervalId.current = id;
    }, []);

    const onStopGenerator = useCallback(() => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            setMessage((prevMessage) => {
                const lastMessage = prevMessage[prevMessage.length - 1];
                if (lastMessage.status && lastMessage.status !== 'complete') {
                    let newMessage = {...lastMessage};
                    newMessage.status = 'complete';
                    return [
                        ...prevMessage.slice(0, -1),
                        newMessage
                    ]
                } else {
                    return prevMessage;
                }
            })
        }
    }, []);

    return (
        <Chat 
            chats={message}
            showStopGenerate={true}
            style={commonOuterStyle}
            onStopGenerator={onStopGenerator}
            roleConfig={roleInfo}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
            uploadProps={uploadProps}
        />
    )
}

export default DynamicUpdateChat;