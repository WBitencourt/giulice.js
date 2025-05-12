import { ThumbsDown } from "lucide-react";
import { ThumbsUp } from "lucide-react";

interface ValidadorCampoAuditoriaProps {
  value: boolean | undefined;
  onApprove: () => void;
  onReject: () => void;
  children: React.ReactNode;
}

export const Hr = ({ value }: { value: boolean | undefined }) => {
  if (value === undefined) {
    return <hr className="bg-orange-300 dark:bg-orange-400 h-2 rounded-full" />;
  }

  if (value === true) {
    return <hr className="bg-green-600 h-2 rounded-full" />;
  }

  return <hr className="bg-red-600 h-2 rounded-full" />;
};

export const ValidadorCampoAuditoria = ({ 
  value, 
  onApprove, 
  onReject, 
  children,
}: ValidadorCampoAuditoriaProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div>
        {children}
      </div>
      <div className="ml-2 flex gap-2 flex-row justify-end">
        <ThumbsUp
          data-active={value === true}
          className="w-4 h-4 hover:scale-125 cursor-pointer text-gray-400 data-[active=true]:text-green-500 hover:text-green-500"
          onClick={onApprove}
        />
        <ThumbsDown
          data-inactive={value === false}
          className="w-4 h-4 hover:scale-125 cursor-pointer text-gray-400 data-[inactive=true]:text-red-500 hover:text-red-500"
          onClick={onReject}
        />
      </div>
      <div>
        <Hr value={value} />
      </div>
    </div>

  );
};


