/* pid_controller.c */
#include "pid_controller.h"

float PID_Update(PID_t *pid, float setpoint, float measurement)
{
    float error = setpoint - measurement;
    pid->integral += error * pid->dt;
    float derivative = (error - pid->prev_error) / pid->dt;
    float out = pid->Kp*error + pid->Ki*pid->integral + pid->Kd*derivative;

    if (out > pid->max) out = pid->max;
    if (out < pid->min) out = pid->min;

    pid->prev_error = error;
    return out;
}
