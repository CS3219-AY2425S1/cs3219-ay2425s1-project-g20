// declare css modules to be recognised by typescript
declare module "*.module.css";

//for svg files
declare module "*.svg" {
  const content: string;
  export default content;
}
