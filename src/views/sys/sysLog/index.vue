<!--
 @description: 系统日志
 @author: mfish
 @date: 2023-01-08
 @version: V1.0.0
-->
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:info-circle-outlined',
                onClick: handleQuery.bind(null, record),
                auth: 'sys:sysLog:update'
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'sys:sysLog:delete'
              },
            ]"
          />
        </template>
        <template v-if="column.key === 'reqSource'">
          <Tag v-for="item in reqSource" v-show="record.reqSource == item.dictValue" :color="item.color">
            {{ item.dictLabel }}
          </Tag>
        </template>
        <template v-if="column.key === 'operType'">
          <Tag v-for="item in operType" v-show="record.operType == item.dictValue" :color="item.color">
            {{ item.dictLabel }}
          </Tag>
        </template>
        <template v-if="column.key === 'reqType'">
          <Tag v-for="item in reqType" v-show="record.reqType == item.dictValue" :color="item.color">
            {{ item.dictLabel }}
          </Tag>
        </template>
      </template>
    </BasicTable>
    <SysLogModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { onBeforeMount, ref } from "vue";
import { Tag } from "ant-design-vue";
import { BasicTable, useTable, TableAction } from "/@/components/general/Table";
import { deleteSysLog, getSysLogList } from "/@/api/sys/SysLog";
import { useModal } from "/@/components/general/Modal";
import SysLogModal from "./SysLogModal.vue";
import { columns, searchFormSchema } from "./sysLog.data";
import { usePermission } from "/@/hooks/web/UsePermission";
import { getDictItems } from "/@/api/sys/DictItem";
import { DictItem } from "/@/api/sys/model/DictItemModel";

export default {
  name: "SysLogManagement",
  components: { BasicTable, SysLogModal, TableAction, Tag },
  setup() {
    const { hasPermission } = usePermission();
    const [registerModal, { openModal }] = useModal();
    const [registerTable, { reload }] = useTable({
      title: "系统日志列表",
      api: getSysLogList,
      columns,
      formConfig: {
        labelWidth: 100,
        schemas: searchFormSchema
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      actionColumn: {
        width: 80,
        title: "操作",
        dataIndex: "action",
        fixed: undefined
      }
    });
    let reqSource = ref<DictItem[]>([]);
    let operType = ref<DictItem[]>([]);
    let reqType = ref<DictItem[]>([]);
    onBeforeMount(() => {
      getReqSource();
      getOperType();
      getReqType();
    });

    function getReqSource() {
      getDictItems("sys_req_source").then((res) => {
        reqSource.value = res;
      });
    }

    function getOperType() {
      getDictItems("sys_log_type").then((res) => {
        operType.value = res;
      });
    }

    function getReqType() {
      getDictItems("sys_req_type").then((res) => {
        reqType.value = res;
      });
    }

    function handleQuery(record: Recordable) {
      openModal(true, record);
    }

    function handleDelete(record: Recordable) {
      deleteSysLog(record.id).then(() => {
        handleSuccess();
      });
    }

    function handleSuccess() {
      reload();
    }

    return {
      registerTable,
      registerModal,
      handleQuery,
      handleDelete,
      handleSuccess,
      hasPermission,
      reqSource,
      operType,
      reqType
    };
  }
};
</script>
