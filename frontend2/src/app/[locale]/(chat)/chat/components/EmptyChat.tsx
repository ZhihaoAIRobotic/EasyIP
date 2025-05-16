import { Empty } from '@douyinfe/semi-ui';

export const EmptyChat = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Empty
        title="Chat with AI Tutor"
        description="Feel free to ask questions or use suggestions below"
      />
      <p>
        Feel free to ask questions or use suggestions below
      </p>
    </div>
  );
};
