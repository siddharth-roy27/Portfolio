/* state_machine.c */
#include "state_machine.h"
#include "motor_control.h"
#include "sensor_manager.h"
#include "fault_table.h"

SystemState_t g_state = STATE_IDLE;

void StateMachine_Update(void)
{
    switch (g_state) {
    case STATE_IDLE: break;
    case STATE_TAPING: break;
    case STATE_CORNER: break;
    case STATE_CLEANING: break;
    case STATE_FAULT: Motor_SetDuty(0, 0); break;
    }
}
