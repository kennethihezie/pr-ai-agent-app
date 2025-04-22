export interface PRData {
    title: string;
    author: string;
    branch: string;
    base: string;
    body: string;
    files: { status: string; filename: string }[];
    commits: { commit: { message: string } }[];
  }