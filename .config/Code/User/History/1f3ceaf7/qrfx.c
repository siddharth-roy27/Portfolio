/* safety_manager.c */
#include "safety_manager.h"
#include "motor_control.h"
#include "fault_table.h"

void TaskSafetyMonitor(void *argument)
{
    for (;;) {
        if (Fault_Active()) Safety_Trip();
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

void Safety_Trip(void)
{
    Motor_SetDuty(0, 0);
    HAL_GPIO_WritePin(LED_FAULT_GPIO_Port, LED_FAULT_Pin, GPIO_PIN_SET);
}
