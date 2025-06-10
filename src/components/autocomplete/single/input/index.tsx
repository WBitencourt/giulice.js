import { TextField } from "@/components/textfield";
import * as Icon from "@phosphor-icons/react";
import useContext from "../contexts";
import { TypeMaskTextField } from "@/components/textfield/content/input";

export interface AutocompleteSingleInputProps extends React.ComponentProps<'input'> {
  label: string;
  typeMask?: TypeMaskTextField;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClean?: () => void;
}

interface InputIconArrowProps {
  showPickList: boolean;
}

const InputIconArrow = ({ showPickList }: InputIconArrowProps) => {
  return (
    <span>
      {
        showPickList ?
        <Icon.CaretUp 
          className='text-cyan-500 text-base' 
          weight='fill' 
        />
        :
        <Icon.CaretDown 
          className='text-cyan-500 text-base' 
          weight='fill' 
        />
      }
    </span>
  )
}

export const AutocompleteSingleInput = ({ 
  label,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onClean,
  typeMask,
  ...props
}: AutocompleteSingleInputProps) => {

  const { 
    inputRef,
    showPickList,
    selectedOption: selectedOptionContext,
    onChangeInput,
    onFocusInput,
    onBlurInput,
    onKeyDownInput,
    onClickCleanInput,
  } = useContext();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeInput(event);

    if(onChange) {
      onChange(event);
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocusInput(event);

    if(onFocus) {
      onFocus(event);
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlurInput(event);

    if(onBlur) {
      onBlur(event);
    } 
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDownInput(event);

    if(onKeyDown) {
      onKeyDown(event);
    }
  }

  const handleClean = () => {
    onClickCleanInput();

    if(onClean) {
      onClean();
    }
  }

  return (
    <TextField.Root className="w-full">
      <TextField.Content.Root>
        <TextField.Content.Label>
          { label }
        </TextField.Content.Label>
        <TextField.Content.Input 
          {...props}
          ref={inputRef}
          type="text" 
          typeMask={typeMask}
          onChange={handleOnChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          value={selectedOptionContext?.label}
        />
      </TextField.Content.Root>
      <TextField.Button.Root>
        <TextField.Button.Clean 
          onClick={handleClean} 
        />
        <InputIconArrow showPickList={showPickList} />
      </TextField.Button.Root>
    </TextField.Root>
  );
}