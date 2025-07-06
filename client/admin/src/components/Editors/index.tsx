import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { setDataPost } from "../../features/post/post.slice";
const URL_API: string = import.meta.env.VITE_URL_API;

const Editors: React.FC = () => {
  const accessToken = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );
  const dispatch = useAppDispatch();
  const handleUploadImage = (blobInfo: any) => {
    return new Promise((resolve: any, reject: any) => {
      const file = blobInfo.blob();
      const formData = new FormData();
      formData.append("image", file);
      axios
        .post(`${URL_API}/image/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "json",
        })
        .then((res) => {
          if (res && res.data) {
            const imageUrl = res.data.url;
            resolve(imageUrl);
          }
        })
        .catch((error: any) => {
          reject(error.message || "Lỗi upload ảnh!");
        });
    });
  };
  const handleEditorChange = (content: string) => {
    dispatch(setDataPost({ content }));
  };
  return (
    <Editor
      apiKey={import.meta.env.VITE_API_KEY_TINYMCE}
      init={{
        height: "500px",
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
      initialValue=""
      onEditorChange={handleEditorChange}
    />
  );
};
export default Editors;
