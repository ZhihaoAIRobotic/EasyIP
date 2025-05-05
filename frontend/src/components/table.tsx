"use client";

import React, { useState, useRef } from 'react';
import { Table, Button, Upload, Modal, Typography, Space } from "@douyinfe/semi-ui";
import { IconUpload, IconPlay, IconMusic } from '@douyinfe/semi-icons';
import type { BeforeUploadProps } from '@douyinfe/semi-ui/lib/es/upload';

interface MediaItem {
    type: 'audio' | 'image' | 'video';
    url: string;
    name: string;
    file?: File;
}

interface TableData {
    script: string;
    sound: MediaItem[];
    media: MediaItem[];
}

function ScriptTable() {
    const [data, setData] = useState<TableData[]>([
        { 
            script: 'Opening Scene:\n[Camera pans over city skyline]\nWelcome to our innovative product demonstration. Today, we\'ll show you how our solution can transform your workflow.',
            sound: [],
            media: []
        },
        { 
            script: 'Product Introduction:\n[Close-up of product]\nOur product features an intuitive interface designed with user experience in mind.',
            sound: [],
            media: []
        },
        { 
            script: 'Key Features:\n[Split screen showing multiple features]\nLet\'s explore the key features that make our product stand out.',
            sound: [],
            media: []
        },
    ]);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewType, setPreviewType] = useState<'audio' | 'image' | 'video'>('image');
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePreview = (url: string, type: 'audio' | 'image' | 'video') => {
        setPreviewUrl(url);
        setPreviewType(type);
        setPreviewVisible(true);
    };

    const handleUpload = (file: File, rowIndex: number, columnType: 'sound' | 'media') => {
        const url = URL.createObjectURL(file);
        let type: 'audio' | 'image' | 'video';
        
        if (file.type.startsWith('audio/')) {
            type = 'audio';
        } else if (file.type.startsWith('image/')) {
            type = 'image';
        } else if (file.type.startsWith('video/')) {
            type = 'video';
        } else {
            return; // Invalid file type
        }
        
        setData(prevData => {
            const newData = [...prevData];
            newData[rowIndex][columnType] = [...newData[rowIndex][columnType], {
                type,
                url,
                name: file.name,
                file
            }];
            return newData;
        });
    };

    const renderMediaItem = (item: MediaItem) => {
        const commonStyle = {
            width: '100px',
            height: '60px',
            objectFit: 'cover' as const,
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative' as const,
            overflow: 'hidden' as const,
        };

        if (item.type === 'image') {
            return (
                <div style={commonStyle} onClick={() => handlePreview(item.url, 'image')}>
                    <img 
                        src={item.url} 
                        alt={item.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            );
        }

        if (item.type === 'video') {
            return (
                <div style={commonStyle} onClick={() => handlePreview(item.url, 'video')}>
                    <video 
                        src={item.url}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}
                        muted
                        preload="metadata"
                    />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <IconPlay size="small" />
                    </div>
                </div>
            );
        }

        if (item.type === 'audio') {
            return (
                <div 
                    style={{
                        ...commonStyle,
                        flexDirection: 'column' as const,
                        gap: '4px',
                        padding: '8px'
                    }} 
                    onClick={() => handlePreview(item.url, 'audio')}
                >
                    <IconMusic size="large" />
                    <Typography.Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                        {item.name}
                    </Typography.Text>
                </div>
            );
        }
    };

    const renderMediaPreview = (items: MediaItem[], rowIndex: number, columnType: 'sound' | 'media') => {
        return (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Space wrap>
                    {items.map((item, index) => (
                        <div key={index}>
                            {renderMediaItem(item)}
                        </div>
                    ))}
                    <Upload
                        accept={columnType === 'sound' ? 'audio/*' : 'image/*,video/*'}
                        showUploadList={false}
                        beforeUpload={(file: BeforeUploadProps) => {
                            if (file instanceof File) {
                                handleUpload(file, rowIndex, columnType);
                            }
                            return false;
                        }}
                    >
                        <Button 
                            icon={<IconUpload />} 
                            type="tertiary" 
                            size="small"
                            style={{ height: '60px', width: '100px' }}
                        />
                    </Upload>
                </Space>
            </div>
        );
    };

    const columns = [
        {
            title: 'Line/Script',
            dataIndex: 'script',
            width: '45%',
            render: (text: string) => (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Sound',
            dataIndex: 'sound',
            width: '25%',
            render: (items: MediaItem[], _: TableData, rowIndex: number) => 
                renderMediaPreview(items, rowIndex, 'sound'),
        },
        {
            title: 'Image/Video',
            dataIndex: 'media',
            width: '30%',
            render: (items: MediaItem[], _: TableData, rowIndex: number) => 
                renderMediaPreview(items, rowIndex, 'media'),
        },
    ];

    return (
        <div style={{ 
            border: '1px solid #e9e9e9', 
            borderRadius: '8px', 
            padding: '20px', 
            height: '90vh',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            <Table
                pagination={false}
                columns={columns}
                dataSource={data}
                rowKey="script"
                style={{ height: '100%' }}
            />
            <Modal
                visible={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={800}
                centered
            >
                {previewType === 'image' && (
                    <img src={previewUrl} style={{ width: '100%' }} alt="Preview" />
                )}
                {previewType === 'video' && (
                    <video 
                        ref={videoRef}
                        src={previewUrl} 
                        controls 
                        style={{ width: '100%' }}
                        autoPlay
                    />
                )}
                {previewType === 'audio' && (
                    <div style={{ padding: '20px' }}>
                        <audio 
                            src={previewUrl} 
                            controls 
                            style={{ width: '100%' }}
                            autoPlay
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ScriptTable;