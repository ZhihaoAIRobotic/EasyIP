'use client';

import type { BeforeUploadProps } from '@douyinfe/semi-ui/lib/es/upload';
import { IconMusic, IconPlay, IconUpload } from '@douyinfe/semi-icons';
import {
  Button,
  Modal,
  Space,
  Table,
  Typography,
  Upload,
} from '@douyinfe/semi-ui';
import { useEffect, useRef, useState } from 'react';

type MediaItem = {
  type: 'audio' | 'image' | 'video';
  url: string;
  name: string;
  file?: File;
};

type TableData = {
  line: number;
  script: string;
  sound: MediaItem[];
  media: MediaItem[];
};

function ScriptTable() {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState<'audio' | 'image' | 'video'>(
    'image',
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  // Add event listener for table updates
  useEffect(() => {
    const handleTableUpdate = (event: CustomEvent) => {
      const result = event.detail;
      if (result && result.lines) {
        setLoading(true);
        const newData = result.lines.map((line: any) => ({
          line: line.line,
          script: line.script,
          sound: [],
          media: [],
        }));
        setData(newData);
        setLoading(false);
      }
    };

    window.addEventListener('updateTable', handleTableUpdate as EventListener);
    return () => {
      window.removeEventListener('updateTable', handleTableUpdate as EventListener);
    };
  }, []);

  const handlePreview = (url: string, type: 'audio' | 'image' | 'video') => {
    setPreviewUrl(url);
    setPreviewType(type);
    setPreviewVisible(true);
  };

  const handleUpload = (
    file: File,
    rowIndex: number,
    columnType: 'sound' | 'media',
  ) => {
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

    setData((prevData) => {
      const newData = [...prevData];
      if (newData[rowIndex] && newData[rowIndex][columnType]) {
        newData[rowIndex][columnType] = [
          ...newData[rowIndex][columnType],
          {
            type,
            url,
            name: file.name,
            file,
          },
        ];
      }
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
        <button
          type="button"
          style={commonStyle}
          onClick={() => handlePreview(item.url, 'image')}
          aria-label={`Preview image ${item.name}`}
        >
          <img
            src={item.url}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        </button>
      );
    }

    if (item.type === 'video') {
      return (
        <button
          type="button"
          style={commonStyle}
          onClick={() => handlePreview(item.url, 'video')}
          aria-label={`Preview video ${item.name}`}
        >
          <video
            src={item.url}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
            muted
            preload="metadata"
          />
          <div
            style={{
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
              justifyContent: 'center',
            }}
          >
            <IconPlay size="small" />
          </div>
        </button>
      );
    }

    if (item.type === 'audio') {
      return (
        <button
          type="button"
          style={{
            ...commonStyle,
            flexDirection: 'column' as const,
            gap: '4px',
            padding: '8px',
          }}
          onClick={() => handlePreview(item.url, 'audio')}
          aria-label={`Preview audio ${item.name}`}
        >
          <IconMusic size="large" />
          <Typography.Text
            type="secondary"
            style={{ fontSize: '12px', textAlign: 'center' }}
          >
            {item.name}
          </Typography.Text>
        </button>
      );
    }
  };

  const renderMediaPreview = (
    items: MediaItem[],
    rowIndex: number,
    columnType: 'sound' | 'media',
  ) => {
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Space wrap>
          {items.map((item, index) => (
            <div key={index}>{renderMediaItem(item)}</div>
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
      title: 'Line',
      dataIndex: 'line',
      width: '10%',
      render: (text: number) => (
        <div style={{ textAlign: 'center' }}>{text}</div>
      ),
    },
    {
      title: 'Script',
      dataIndex: 'script',
      width: '35%',
      render: (text: string) => (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{text}</div>
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ y: 'calc(100vh - 200px)' }}
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
          >
            <track kind="captions" src="" label="English" />
          </video>
        )}
        {previewType === 'audio' && (
          <audio controls style={{ width: '100%' }}>
            <source src={previewUrl} type="audio/mpeg" />
            <track kind="captions" src="" label="English" />
            Your browser does not support the audio element.
          </audio>
        )}
      </Modal>
    </div>
  );
}

export default ScriptTable;
