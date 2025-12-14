#include "threadpool.h"
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

extern void handle_client(int client_fd);

threadpool_t *threadpool_create(int threads, int queue_size) {
    threadpool_t *pool = malloc(sizeof(threadpool_t));

    pool->thread_count = threads;
    pool->queue_size = queue_size;
    pool->queue = malloc(sizeof(job_t) * queue_size);
    
    pool->front = pool->rear = pool->count = 0;
    pool->stop = 0;

    pthread_mutex_init(&pool->lock, NULL);
    pthread_cond_init(&pool->cond, NULL);

    pool->threads = malloc(sizeof(pthread_t) * threads);

    for (int i = 0; i < threads; i++) {
        pthread_create(&pool->threads[i], NULL, threadpool_worker, pool);
    }

    return pool;
}

void threadpool_add_job(threadpool_t *pool, int client_fd) {
    pthread_mutex_lock(&pool->lock);

    while (pool->count == pool->queue_size) {
        // Wait for free space
        pthread_cond_wait(&pool->cond, &pool->lock);
    }

    pool->queue[pool->rear].client_fd = client_fd;
    pool->rear = (pool->rear + 1) % pool->queue_size;
    pool->count++;

    pthread_cond_broadcast(&pool->cond);
    pthread_mutex_unlock(&pool->lock);
}

void *threadpool_worker(void *arg) {
    threadpool_t *pool = (threadpool_t *)arg;

    while (1) {
        pthread_mutex_lock(&pool->lock);

        while (pool->count == 0 && !pool->stop) {
            pthread_cond_wait(&pool->cond, &pool->lock);
        }

        if (pool->stop) {
            pthread_mutex_unlock(&pool->lock);
            pthread_exit(NULL);
        }

        int client_fd = pool->queue[pool->front].client_fd;
        pool->front = (pool->front + 1) % pool->queue_size;
        pool->count--;

        pthread_cond_broadcast(&pool->cond);
        pthread_mutex_unlock(&pool->lock);

        handle_client(client_fd);
    }
}
