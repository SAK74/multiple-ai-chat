import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";
import { useAssistant } from "./hooks/localStorage.hook";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export type SetupProps = {
  apiKey?: string;
  setApiKey: Dispatch<SetStateAction<string | undefined>>;
};

export const SetupForm: FC<PropsWithChildren<SetupProps>> = ({
  apiKey,
  setApiKey,
  children,
}) => {
  const { assystentDescription, setAssysDescription } = useAssistant();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup</DialogTitle>
          <DialogDescription>
            You can customize your environment
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            const description = ev.currentTarget["descriptor"].value;
            setAssysDescription(description);
            const apiKey = ev.currentTarget["api_key"].value;
            setApiKey(apiKey);
            console.log("Form submitted!");
          }}
          className="space-y-4"
        >
          <Textarea
            name="descriptor"
            placeholder="Assystent prefernces"
            defaultValue={assystentDescription}
          />
          <Input
            type="password"
            name="api_key"
            placeholder="You API key"
            className=""
            defaultValue={apiKey}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={"outline"} type="submit">
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
