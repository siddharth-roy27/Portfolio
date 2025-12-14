/* state_machine.h */
#ifndef STATE_MACHINE_H
#define STATE_MACHINE_H
typedef enum {
    STATE_IDLE,
    STATE_TAPING,
    STATE_CORNER,
    STATE_CLEANING,
    STATE_FAULT
} SystemState_t;

extern SystemState_t g_state;
void StateMachine_Update(void);
#endif
