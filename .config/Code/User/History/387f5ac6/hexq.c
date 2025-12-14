/* motor_control.c */
#include "motor_control.h"
#include "tim.h"

static PID_t pid_tape, pid_pump;

void TaskMotorControl(void *argument)
{
    float set_speed = 0, measured_speed = 0, control_output;
    for (;;) {
        measured_speed = Encoder_GetSpeed();
        control_output = PID_Update(&pid_tape, set_speed, measured_speed);
        Motor_SetDuty(control_output, control_output);
        vTaskDelay(pdMS_TO_TICKS(1)); // 1 kHz loop
    }
}

void Motor_SetDuty(float left, float right)
{
    __HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_1, left);
    __HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_2, right);
}
