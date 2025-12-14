#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <pthread.h>

typedef struct {
    int client_fd;
} job_t;

typedef struct {
    pthread_mutex_t lock;
    pthread_cond_t cond;
    job_t *queue;
    int queue_size;
    int front, rear, count;
    pthread_t *threads;
    int thread_count;
    int stop;
} threadpool_t;

threadpool_t *threadpool_create(int threads, int queue_size);
void threadpool_add_job(threadpool_t *pool, int client_fd);
void *threadpool_worker(void *arg);
void threadpool_destroy(threadpool_t *pool);

#endif
