import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FormField = ({ label, id, error, ...inputProps }) => (
  <div className="space-y-1.5">
    {label && <Label htmlFor={id}>{label}</Label>}
    <Input id={id} {...inputProps} />
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export default FormField;
