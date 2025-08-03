import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setPost } from "../../features/post/selectedPost.slice";
import { uploadImage } from "../../features/image/image.service";
import { RootState } from "../../app/store";

const Editors: React.FC = () => {
  const selectedPost = useAppSelector((state: RootState) => state.selectedPost);
  const dispatch = useAppDispatch();
  const handleUploadImage = (blobInfo: any) => {
    return new Promise((resolve: any, reject: any) => {
      const file = blobInfo.blob();
      const formData = new FormData();
      formData.append("image", file);

      uploadImage(formData)
        .then(({ url }) => {
          resolve(url);
        })
        .catch((error: any) => {
          reject(error.message || "Lỗi upload ảnh!");
        });
    });
  };
  const handleEditorChange = (content: string) => {
    dispatch(setPost({ content }));
  };
  return (
    <Editor
      apiKey={import.meta.env.VITE_API_KEY_TINYMCE}
      init={{
        height: "700px",
        language: "vi",
        plugins:
          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        mergetags_list: [
          { value: "baodt2911", title: "First Name" },
          { value: "dobao2911bs@gmail.com", title: "Email" },
        ],
        // ai_request: (request, respondWith) =>
        //   respondWith.string(() =>
        //     Promise.reject("See docs to implement AI Assistant")
        //   ),
        images_upload_handler: handleUploadImage,
      }}
      initialValue={selectedPost.content}
      onEditorChange={handleEditorChange}
    />
  );
};
export default Editors;
