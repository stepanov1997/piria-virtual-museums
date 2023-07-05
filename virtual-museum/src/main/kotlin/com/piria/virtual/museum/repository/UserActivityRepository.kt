package com.piria.virtual.museum.repository

import com.piria.virtual.museum.model.UserActivity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface UserActivityRepository : JpaRepository<UserActivity, Long> {
    fun findAllByUserId(userId: Long): List<UserActivity>

    @Query("SELECT count(distinct(user_id)) FROM user_activity ua WHERE ua.timestamp >= UNIX_TIMESTAMP(NOW() - INTERVAL 5 MINUTE)", nativeQuery = true)
    fun getCurrentlyActiveUsers(): Int

    @Query(value = """
        WITH all_hours AS (
            SELECT HOUR(hour_timestamp) AS hour
            FROM (
                     SELECT TIMESTAMP(DATE_SUB(UTC_TIMESTAMP(), INTERVAL hours_passed HOUR) + INTERVAL 2 HOUR) AS hour_timestamp
                     FROM (
                              SELECT 0 AS hours_passed UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
                              SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
                              SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL
                              SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL
                              SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL
                              SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23
                     ) AS hours
                 ) AS all_hours_subquery
        )
        SELECT all_hours.hour, COUNT(DISTINCT ua.user_id) AS activeUsers
        FROM all_hours
        LEFT JOIN (
            SELECT HOUR(CONVERT_TZ(FROM_UNIXTIME(timestamp), 'UTC', '+02:00')) AS hour, user_id
            FROM museum.user_activity
            WHERE timestamp >= UNIX_TIMESTAMP(NOW() - INTERVAL 24 HOUR - INTERVAL 2 MINUTE)
        ) AS ua ON all_hours.hour = ua.hour
        GROUP BY all_hours.hour
        ORDER BY IF(
            all_hours.hour > HOUR(CONVERT_TZ(UTC_TIMESTAMP(), 'UTC', '+02:00')), 
            all_hours.hour - 24, 
            all_hours.hour
        );
    """, nativeQuery = true
    )
    fun getActiveUsersByHour(): List<*>
}
