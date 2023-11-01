import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import { bulletinBoardApi } from "@/axios/instances/bulletinBoardApi";
import { formatTime } from "@/utilities/formatUtils";
import { Bulletin } from "@/models/Bulletin";
import moment from 'moment'

export const useBulletinBoardStore = defineStore("bulletinBoard", () => {
  const listOfBulletinBoards: Ref<Bulletin[]> = ref([]);
  const bulletinBoardDetail: Ref<Bulletin> = ref();
  const listOfBulletinBoardsWithImage: Ref<Bulletin[]> = ref([]);

  async function fetchListOfBulletinBoards(param?) {
    const data = await bulletinBoardApi.getListOfBulletins(param);
    listOfBulletinBoards.value = data.map(post => ({
      ...post,
      createdDateUTC: moment(post.createdDateUTC).format("MM/DD/YYYY")
    }))
  }

  async function fetchBulletinBoardDetail(id: number): Promise<void> {
    bulletinBoardDetail.value = await bulletinBoardApi.getBulletinBoardDetail(id);
    bulletinBoardDetail.value.essDashboardPublishDate = formatTime(bulletinBoardDetail.value.essDashboardPublishDate);
    bulletinBoardDetail.value.essDashboardExpirationDate = formatTime(bulletinBoardDetail.value.essDashboardExpirationDate);
  }


  async function deletePost(id: number) {
    await bulletinBoardApi.deleteBulletinBoard(id);
    listOfBulletinBoards.value = listOfBulletinBoards.value.filter(item => item.postId !== id);
  }

  async function updateBulletinBoardDetail(postId: number, data: Bulletin) {
    return await bulletinBoardApi.updateBulletinBoardDetail(postId, data)
  }

  async function addBulletinBoard(data: Bulletin) {
    return await bulletinBoardApi.addBulletinBoard(data)
  }

  async function deleteBulletinBoard(bulletinId: number) {
    return await bulletinBoardApi.deleteBulletinBoard(bulletinId)
  }


  function convertBinaryToBase64(blob: Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async function () {
        resolve(reader.result);
      };
    });
  }

  //-- Map list post data with image base64
  async function mapListBulletinWithImage(imgList) {
    for (const image of imgList) {
      if (image.value) {
        image["base64"] = await convertBinaryToBase64(image.value.data);
      }
    }

    const postListMapWithImg = listOfBulletinBoards.value.map(e => ({ ...e }))
    for (let i = 0; i < postListMapWithImg.length; i++) {
      if (imgList[i].base64) {
        postListMapWithImg[i].thumbnailUrl = imgList[i].base64;
      }
    }

    listOfBulletinBoardsWithImage.value = postListMapWithImg
  }



  return {
    fetchListOfBulletinBoards,
    listOfBulletinBoards,
    listOfBulletinBoardsWithImage,
    fetchBulletinBoardDetail,
    bulletinBoardDetail,
    deletePost,
    mapListBulletinWithImage,
    updateBulletinBoardDetail,
    addBulletinBoard,
    deleteBulletinBoard
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBulletinBoardStore, import.meta.hot));
}
