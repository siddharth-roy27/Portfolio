/* comms_ethercat.c */
#include "comms_ethercat.h"

void TaskCommsEtherCAT(void *argument)
{
    for (;;) {
        EtherCAT_ProcessPDOs();
        vTaskDelay(pdMS_TO_TICKS(1));
    }
}
