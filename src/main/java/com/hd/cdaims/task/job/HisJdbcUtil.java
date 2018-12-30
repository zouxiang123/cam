package com.hd.cdaims.task.job;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.druid.pool.DruidDataSource;
import com.xtt.platform.util.config.SpringUtil;

/**
 * jdbc工具类
 * 
 * 
 */
public final class HisJdbcUtil {
    /**
     * 数据库配置文件路径
     */
    // private static final String CONFIG_PATH = "C:/xtt/config/dbconfig.properties";
    /**
     * 数据库连接地址
     */
    private static String url;
    /**
     * 用户名
     */
    private static String userName;
    /**
     * 密码
     */
    private static String password;

    private static String driver;
    String HG_DD_FORMAT = "yyyy-MM-dd";
    String HG_SS_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public String language = "GBK";
    String LANGUAGE_GBK = "GBK";// 编码问题
    /**
     * 装载驱动
     */
    static {
        DruidDataSource dataSource = (DruidDataSource) SpringUtil.getBean("dataSourceIfmd");
        /*
         * Properties p = new Properties(); p.load(new
         * FileInputStream(CONFIG_PATH));
         */
        driver = dataSource.getDriverClassName();
        url = dataSource.getUrl();
        userName = dataSource.getUsername();
        password = dataSource.getPassword();
        try {
            Class.forName(driver);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * 建立数据库连接
     * 
     * @return
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, userName, password);
    }

    /**
     * 返回单个结果值，如count\min\max等
     * 
     * @param sql
     *            sql语句
     * @return 结果
     * @throws SQLException
     */
    public static Object getSingle(String sql) throws SQLException {
        Object result = null;
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            if (rs.next()) {
                result = rs.getObject(1);
            }
            return result;
        } catch (SQLException e) {
            throw e;
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 返回单个结果值，如count\min\max等
     * 
     * @param sql
     *            sql语句
     * @param paramters
     *            参数列表
     * @return 结果
     * @throws SQLException
     */
    public static Object getSingle(String sql, Object[] paramters) throws SQLException {
        Object result = null;
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            if (paramters != null) {
                for (int i = 0; i < paramters.length; i++) {
                    stmt.setObject(i + 1, paramters[i]);
                }
            }
            rs = stmt.executeQuery();
            if (rs.next()) {
                result = rs.getObject(1);
            }
            return result;
        } catch (SQLException e) {
            throw e;
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 用于查询，返回结果集
     * 
     * @param sql
     *            sql语句
     * @return 结果集
     * @throws SQLException
     */
    public static List<Map<String, Object>> query(String sql) throws SQLException {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            return ResultToListMap(rs);
        } catch (SQLException e) {
            throw e;
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 用于带参数的查询，返回结果集
     * 
     * @param sql
     *            sql语句
     * @param paramters
     *            参数集合
     * @return 结果集
     * @throws SQLException
     */
    public static List<Map<String, Object>> query(String sql, Object[] paramters) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            if (paramters != null) {
                for (int i = 0; i < paramters.length; i++) {
                    stmt.setObject(i + 1, paramters[i]);
                }
            }
            rs = stmt.executeQuery();
            return ResultToListMap(rs);
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 用于增删改
     * 
     * @param sql
     *            sql语句
     * @return 影响行数
     * @throws SQLException
     */
    public static int update(String sql) throws SQLException {
        Connection conn = null;
        Statement stmt = null;
        try {
            conn = getConnection();
            stmt = conn.createStatement();
            return stmt.executeUpdate(sql);
        } catch (SQLException e) {
            throw e;
        } finally {
            free(conn, stmt, null);
        }
    }

    /**
     * 用于增删改（带参数）
     * 
     * @param sql
     *            sql语句
     * @param paramters
     *            sql语句
     * @return 影响行数
     * @throws SQLException
     */
    public static int update(String sql, Object[] paramters) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            if (paramters != null) {
                for (int i = 0; i < paramters.length; i++) {
                    stmt.setObject(i + 1, paramters[i]);
                }
            }
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            free(conn, stmt, null);
        }
    }

    /**
     * 插入值后返回主键值
     * 
     * @param sql
     *            插入sql语句
     * @return 返回结果
     * @throws Exception
     */
    public static Object insertWithReturnPrimeKey(String sql) throws SQLException {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        Object result = null;
        try {
            conn = getConnection();
            stmt = conn.createStatement();
            stmt.execute(sql, Statement.RETURN_GENERATED_KEYS);
            rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                result = rs.getObject(1);
            }
            return result;
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 插入值后返回主键值
     * 
     * @param sql
     *            插入sql语句
     * @param paramters
     *            参数列表
     * @return 返回结果
     * @throws SQLException
     */
    public static Object insertWithReturnPrimeKey(String sql, Object[] paramters) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Object result = null;
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            if (paramters != null) {
                for (int i = 0; i < paramters.length; i++) {
                    stmt.setObject(i + 1, paramters[i]);
                }
            }
            stmt.execute();
            rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                result = rs.getObject(1);
            }
            return result;
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 调用存储过程执行查询
     * 
     * @param procedureSql
     *            存储过程
     * @return
     * @throws SQLException
     */
    public static List<Map<String, Object>> callableQuery(String procedureSql) throws SQLException {
        return callableQuery(procedureSql, null);
    }

    /**
     * 调用存储过程（带参数）,执行查询
     * 
     * @param procedureSql
     *            存储过程
     * @param paramters
     *            参数表
     * @return
     * @throws SQLException
     */
    public static List<Map<String, Object>> callableQuery(String procedureSql, Object[] paramters) throws SQLException {
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            stmt = conn.prepareCall(procedureSql);
            if (paramters != null) {
                for (int i = 0; i < paramters.length; i++) {
                    stmt.setObject(i + 1, paramters[i]);
                }
            }
            rs = stmt.executeQuery();
            return ResultToListMap(rs);
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 调用存储过程，查询单个值
     * 
     * @param procedureSql
     * @return
     * @throws SQLException
     */
    public static Object callableGetSingle(String procedureSql) throws SQLException {
        return callableGetSingle(procedureSql, null);
    }

    /**
     * 调用存储过程(带参数)，查询单个值
     * 
     * @param procedureSql
     * @param parameters
     * @return
     * @throws SQLException
     */
    public static Object callableGetSingle(String procedureSql, Object[] paramters) throws SQLException {
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            stmt = conn.prepareCall(procedureSql);
            if (paramters != null) {
                for (int i = 0; i < paramters.length; i++) {
                    stmt.setObject(i + 1, paramters[i]);
                }
            }
            rs = stmt.executeQuery();
            return ResultToListMap(rs);
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 调用存储过程，执行增删改
     * 
     * @param procedureSql
     *            存储过程
     * @return 影响行数
     * @throws SQLException
     */
    public static int callableUpdate(String procedureSql) throws SQLException {
        return callableUpdate(procedureSql, null);
    }

    /**
     * 调用存储过程（带参数），执行增删改
     * 
     * @param procedureSql
     *            存储过程
     * @param parameters
     * @return 影响行数
     * @throws SQLException
     */
    public static int callableUpdate(String procedureSql, Object[] parameters) throws SQLException {
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            stmt = conn.prepareCall(procedureSql);
            if (parameters != null) {
                for (int i = 0; i < parameters.length; i++) {
                    stmt.setObject(i + 1, parameters[i]);
                }
            }
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new SQLException(e);
        } finally {
            free(conn, stmt, rs);
        }
    }

    /**
     * 批量更新数据
     * 
     * @param sqlList
     *            一组sql
     * @return
     */
    public static int[] batchUpdate(List<String> sqlList) {
        int[] result = new int[] {};
        Connection conn = null;
        Statement statenent = null;
        try {
            conn = getConnection();
            conn.setAutoCommit(false);
            statenent = conn.createStatement();
            for (String sql : sqlList) {
                statenent.addBatch(sql);
            }
            result = statenent.executeBatch();
            conn.commit();
        } catch (SQLException e) {
            try {
                conn.rollback();
            } catch (SQLException e1) {
                // TODO Auto-generated catch block
                throw new ExceptionInInitializerError(e1);
            }
            throw new ExceptionInInitializerError(e);
        } finally {
            free(conn, statenent, null);
        }
        return result;
    }

    private static List<Map<String, Object>> ResultToListMap(ResultSet rs) throws SQLException {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        while (rs.next()) {
            ResultSetMetaData md = rs.getMetaData();
            Map<String, Object> map = new HashMap<String, Object>();
            for (int i = 1; i <= md.getColumnCount(); i++) {
                map.put(md.getColumnLabel(i), rs.getObject(i));
            }
            list.add(map);
        }
        return list;
    }

    /**
     * 释放资源
     * 
     * @param conn
     * @param statement
     * @param rs
     */
    public static void free(Connection conn, Statement statement, ResultSet rs) {
        try {
            if (rs != null) {
                rs.close();
            }
            if (statement != null) {
                statement.close();
            }
            if (conn != null) {
                conn.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}