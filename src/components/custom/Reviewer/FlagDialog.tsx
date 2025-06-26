import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

interface FlagDialogProps {
  onFlag: (reason: string) => void;
}

export const FlagDialog = ({ onFlag }: FlagDialogProps) => {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onFlag(reason);
    setReason("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Flag</Button>
      </DialogTrigger>

      <DialogContent>
        <h4 className="text-lg font-semibold mb-2">Provide flag reason</h4>
        <Textarea
          placeholder="Explain why you're flagging this content..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mb-4"
        />
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={handleSubmit}
        >
          Submit Flag
        </Button>
      </DialogContent>
    </Dialog>
  );
};
