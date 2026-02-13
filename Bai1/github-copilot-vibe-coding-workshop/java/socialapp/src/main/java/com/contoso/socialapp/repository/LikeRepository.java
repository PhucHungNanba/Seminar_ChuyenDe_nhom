package com.contoso.socialapp.repository;

import com.contoso.socialapp.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostIdAndUsername(Long postId, String username);
    long countByPostId(Long postId);
    boolean existsByPostIdAndUsername(Long postId, String username);
}
