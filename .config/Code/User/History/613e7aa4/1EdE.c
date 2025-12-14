/* fault_table.c */
#include "fault_table.h"
#include "stdio.h"

static bool fault_flag = false;

bool Fault_Active(void) { return fault_flag; }

void Fault_Log(uint16_t id)
{
    fault_flag = true;
    printf("FAULT %d occurred!\n", id);
}
