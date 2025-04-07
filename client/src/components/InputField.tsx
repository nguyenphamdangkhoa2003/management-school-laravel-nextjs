import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;  // Có thể là FieldError hoặc undefined
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  step?: string | number;
  className?: string;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  step,
  className = "md:w-1/4",
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : `flex flex-col gap-2 w-full ${className}`}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
        step={step}
      />
      {/* Kiểm tra nếu có lỗi và hiển thị thông báo lỗi */}
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
