package com.example.realworld.common;

import java.util.List;

public class PageResult<T> {
    private List<T> list;
    private Long total;
    private int pageSize;
    private int pageNumber;
    private int totalPages;

    public PageResult(List<T> list, Long total, int pageSize, int pageNumber) {
        this.list = list;
        this.total = total;
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.totalPages = pageSize == 0 ? 0 : (int) Math.ceil((double) total / pageSize);
    }

    // 下面 getter 必须写全，否则 Jackson 序列化不出来（就是你之前踩的坑）
    public List<T> getList() { return list; }
    public long getTotal() { return total; }
    public int getPageNum() { return pageNumber; }
    public int getPageSize() { return pageSize; }
    public int getTotalPages() { return totalPages; }
}
