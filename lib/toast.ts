import toast from "react-hot-toast";

export const notify = {
  uploadSuccess: () => toast.success("CV uploaded successfully!"),
  analysisDone: (name: string) =>
    toast.success(`Analysis complete for ${name}!`, { duration: 4000 }),
  error: (msg: string) => toast.error(msg, { duration: 5000 }),
  loading: (msg: string) => toast.loading(msg),
};
