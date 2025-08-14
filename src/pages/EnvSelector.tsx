import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EnvSelector = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState("dev");

  const handleEnvironmentChange = (value: string) => {
    setSelectedEnvironment(value);
  };

  const navigate = useNavigate();

  const handleApplySettings = () => {
    alert(`Applying settings for the '${selectedEnvironment}' environment.`);
    localStorage.setItem("env", selectedEnvironment);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Select Environment
          </CardTitle>
          <CardDescription>
            Choose the environment for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Select
              onValueChange={handleEnvironmentChange}
              defaultValue={selectedEnvironment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dev">Development</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>

            <div
              className={`rounded-lg p-4 text-center text-sm ${
                selectedEnvironment === "production"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              You are currently using the **{selectedEnvironment}** environment.
            </div>

            <Button
              onClick={handleApplySettings}
              className="w-full bg-brand hover:bg-brand-dark"
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvSelector;
