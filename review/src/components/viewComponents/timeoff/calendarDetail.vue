<script setup lang="ts">
import { DateHelper } from "@bryntum/calendar";
interface Props {
  isShow?: boolean;
  hideDetail: () => void;
  deleteDetail: (data: any) => void;
  data?: any;
}

const props = withDefaults(defineProps<Props>(), {
  isShow: true,
});
</script>

<template>
  <div class="calendar-overlay" :class="{ overlay: isShow }" @click="hideDetail"></div>
  <div class="calendar-detail" :class="{ show: isShow }">
    <div class="calendar-detail__header">
      <div class="calendar-detail__header-content">
        <div class="content__title">{{ data.name }}</div>
        <div
          class="content__tag"
          v-if="data.resourceId === 'approved' || data.resourceId === 'pending'"
          :class="data.resourceId === 'approved' ? 'approved' : 'pending'"
        >
          {{ data.resourceId === "approved" ? "Approved" : "Pending" }}
        </div>
      </div>
      <div class="calendar-detail__header-close" @click="hideDetail()">&times;</div>
    </div>
    <div class="calendar-detail__body">
      <ul class="calendar-detail__body-list">
        <template v-if="data.resourceId === 'pending' || data.resourceId === 'approved'">
          <li class="list__item">
            <div class="list__item-title">Request Code</div>
            <div class="list__item-content uppercase">
              {{ data.requestCode }}
            </div>
          </li>
          <li class="list__item">
            <div class="list__item-title">Plan Type</div>
            <div class="list__item-content uppercase">{{ data.planType }}</div>
          </li>
          <li class="list__item">
            <div class="list__item-title">Dates</div>
            <div class="list__item-content">
              {{ DateHelper.format(data.startDate, "MM/DD/YYYY") }}
              {{ DateHelper.format(data.startDate, "H:mm") }} -
              {{ DateHelper.format(data.endDate, "H:mm") }}
            </div>
          </li>
          <li class="list__item">
            <div class="list__item-title">Total Leave Time</div>
            <div class="list__item-content">{{ data.totalLeaveTime }}</div>
          </li>
          <li class="list__item">
            <div class="list__item-title">Note</div>
            <div class="list__item-content">
              {{ data.note }}
            </div>
          </li>
        </template>
        <template v-else>
          <li class="list__item">
            <div class="list__item-title">Start</div>
            <div class="list__item-content uppercase">
              {{
                data.allDay === true
                  ? DateHelper.format(data.startDate, "MM/DD/YYYY")
                  : DateHelper.format(data.startDate, "MM/DD/YYYY - H:mm")
              }}
            </div>
          </li>
          <li class="list__item">
            <div class="list__item-title">End</div>
            <div class="list__item-content uppercase">
              {{
                data.allDay === true
                  ? DateHelper.format(data.endDate, "MM/DD/YYYY")
                  : DateHelper.format(data.endDate, "MM/DD/YYYY - H:mm")
              }}
            </div>
          </li>
          <li class="list__item">
            <div class="list__item-title">Repeat</div>
            <div class="list__item-content uppercase">
              {{ data.recurrenceCombo ? data.recurrenceCombo : "NONE" }}
            </div>
          </li>
        </template>
      </ul>
    </div>
    <div class="calendar-detail__footer" v-if="data.resourceId === 'pending'">
      <div class="calendar-detail__footer-button">
        <button class="btn btn-red-outline ml-auto" @click="deleteDetail(data)">
          Cancel Request
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$black: #15181c;
$gray: #8e8e92;
$green: #1abc9c;
$orange: #ff6600;
$red: #fc5555;
$white: #fff;

ul,
li {
  list-style: none;
  padding: 0;
}

button {
  outline: none;
  &:focus {
    outline: none;
  }
}

.uppercase {
  text-transform: uppercase;
}

.calendar-overlay {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  &.overlay {
    opacity: 1;
    visibility: visible;
  }
}
.calendar-detail {
  position: fixed;
  top: 0;
  right: -440px;
  width: 440px;
  height: calc(100% - 44px);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.15);
  z-index: 99;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  margin-top: 44px;
  &.show {
    right: 0;
    z-index: 9999;
  }
  .calendar-detail__header {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #e1e4e8;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    &-content {
      display: flex;
      align-items: center;
      .content__title {
        font-size: 16px;
        font-weight: 700;
        line-height: 19px;
        color: $black;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .content__tag {
        margin-left: 8px;
        padding: 5px 10px;
        border-radius: 30px;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        &.approved {
          color: $green;
          background: rgba(26, 188, 156, 0.15);
        }
        &.pending {
          color: $orange;
          background: rgba(255, 102, 0, 0.15);
        }
      }
    }
    &-close {
      color: $gray;
      font-size: 24px;
      font-weight: 300;
      cursor: pointer;
      margin-left: 8px;
    }
  }
  .calendar-detail__body {
    padding: 20px;
    margin-bottom: auto;
    &-list {
      .list__item {
        display: flex;
        margin-bottom: 24px;
        &-title {
          color: $black;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
          text-transform: capitalize;
          width: 150px;
        }
        &-content {
          line-height: 1.5;
          flex: 1;
          color: #000;
        }
      }
    }
  }
  .calendar-detail__footer {
    padding: 16px;
    border-top: 1px solid rgba(110, 124, 143, 0.31);
    &-button {
      display: flex;
      justify-content: space-between;
      .btn {
        font-size: 14px;
        line-height: 22px;
        text-transform: uppercase;
        padding: 7px 12px;
        border-radius: 3px;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.4s ease-out;
        &-red {
          background: $red;
          border-color: $red;
          color: $white;
          &:hover {
            opacity: 0.7;
          }
          &-outline {
            background: transparent;
            color: $red;
            border-color: $red;
            margin-left: auto;
            margin-right: 12px;
            &:hover {
              background: $red;
              color: $white;
            }
          }
        }
        &-green {
          background: $green;
          border-color: $green;
          color: $white;
          &:hover {
            opacity: 0.7;
          }
          &-outline {
            background: transparent;
            color: $green;
            border-color: $green;
            &:hover {
              background: $green;
              color: $white;
            }
          }
        }
      }
    }
  }
}
</style>
