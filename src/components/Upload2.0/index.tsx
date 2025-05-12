import { DropzoneRoot, Dropzone } from "./Dropzone";
import { UploadProviderBag, UploadRoot } from "./Root";
import { DropzoneInfoTooltipIcon } from "./Dropzone/Info";
import { List } from "./List";

import {
  DragRoot,
  DragPrettierLayout,
  DragView,
} from "./Dropzone/Drag";
import { Row } from "./Item";

export const Upload = {
  Bag: UploadProviderBag,
  Root: UploadRoot,
  Drop: {
    Root: DropzoneRoot,
    Dropzone: Dropzone,
    Drag: {
      Root: DragRoot,
      View: DragView,
      Custom: DragPrettierLayout,
    },
    Info: {
      TooltipIcon: DropzoneInfoTooltipIcon,
    }
  },
  List: {
    Root: List.Root,
    ToggleOpen: List.ToggleOpen,
    Row: {
      Root: Row.Root,
      Name: Row.Name,
      Action: {
        Root: Row.Action.Root,
        Download: Row.Action.Download,
        Link: Row.Action.Link,
        Retry: Row.Action.Retry,
        Status: {
          Success: Row.Action.Status.Success,
          Failure: Row.Action.Status.Failure,
          Pending: Row.Action.Status.Pending,
        }
      },
      Preview: Row.Preview,
      Description: Row.Description,
      Size: Row.Size,
      Remove: Row.Remove,
    }
  },  
}