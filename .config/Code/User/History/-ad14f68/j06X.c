/* ===================================
 * freertos_tasks.c
 * Task creation and scheduler start
 * =================================== */
#include "freertos_tasks.h"
#include "motor_control.h"
#include "sensor_manager.h"
#include "safety_manager.h"
#include "comms_ethercat.h"
#include "fault_table.h"

void MX_FREERTOS_Init(void)
{
    xTaskCreate(TaskMotorControl, "MotorCtrl", 512, NULL, 4, NULL);
    xTaskCreate(TaskSensorUpdate, "Sensor", 512, NULL, 3, NULL);
    xTaskCreate(TaskCommsEtherCAT, "Comms", 512, NULL, 2, NULL);
    xTaskCreate(TaskSafetyMonitor, "Safety", 512, NULL, 5, NULL);
    xTaskCreate(TaskLogger, "Logger", 512, NULL, 1, NULL);
}
