import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SkillsInput } from "@/components/common/SkillsInput";
import { InlineError } from "@/components/common/States";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FormField({ id, label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive" data-testid={`${id}-error`}>{error.message}</p> : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function InterviewForm({ includeCandidate, onSubmit, isPending, error }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: "", role: "", companyName: "", candidateEmail: "", skills: [], description: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" data-testid="interview-create-form">
      <FormField id="title" label="Interview title" error={errors.title}>
        <Input id="title" placeholder="Frontend engineer — first round" data-testid="interview-title-input" aria-invalid={!!errors.title}
          {...register("title", { required: "Add a title", maxLength: { value: 120, message: "Keep it under 120 characters" } })} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="role" label="Role" error={errors.role}>
          <Input id="role" placeholder="Senior Frontend Engineer" data-testid="interview-role-input" aria-invalid={!!errors.role} {...register("role", { required: "Add the role" })} />
        </FormField>
        <FormField id="companyName" label="Company name" error={errors.companyName}>
          <Input id="companyName" placeholder="Acme Inc." data-testid="interview-company-input" aria-invalid={!!errors.companyName} {...register("companyName", { required: "Add the company name" })} />
        </FormField>
      </div>
      {includeCandidate && (
        <FormField id="candidateEmail" label="Candidate email" hint="The candidate will use the interview link generated for this interview." error={errors.candidateEmail}>
          <Input id="candidateEmail" type="email" placeholder="candidate@email.com" data-testid="interview-candidate-email-input" aria-invalid={!!errors.candidateEmail}
            {...register("candidateEmail", { required: "Add the candidate's email", pattern: { value: EMAIL, message: "Enter a valid email" } })} />
        </FormField>
      )}
      <FormField id="skills" label="Skills to assess" hint="Press Enter or comma to add each skill." error={errors.skills}>
        <Controller name="skills" control={control} rules={{ validate: (v) => v.length > 0 || "Add at least one skill" }}
          render={({ field }) => <SkillsInput id="skills" value={field.value} onChange={field.onChange} invalid={!!errors.skills} />} />
      </FormField>
      <FormField id="description" label="Description" hint="What the role involves and what a strong answer looks like." error={errors.description}>
        <Textarea id="description" rows={6} placeholder="Describe the responsibilities, level and focus areas for this interview." data-testid="interview-description-input" aria-invalid={!!errors.description}
          {...register("description", { required: "Add a short description", maxLength: { value: 4000, message: "Keep it under 4000 characters" } })} />
      </FormField>
      <InlineError error={error} testId="interview-create-error" />
      <div className="flex justify-end border-t pt-5">
        <Button type="submit" disabled={isPending} data-testid="interview-create-submit-button">
          {isPending && <Loader2 className="animate-spin" />} {isPending ? "Creating…" : "Create interview"}
        </Button>
      </div>
    </form>
  );
}
