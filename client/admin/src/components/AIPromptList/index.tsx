import { Col, Flex, List, Pagination, Row, Skeleton } from "antd";
import React, { useEffect } from "react";
import AIPromptCard from "../AIPromptCard";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import {
  getPromptFailure,
  getPromptStart,
  getPromptSuccess,
} from "../../features/ai_prompt/ai_prompt.slice";
import { getAllPromptsAsync } from "../../features/ai_prompt/ai_prompt.service";
const SkeletonListCard: React.FC = () => {
  return (
    <Row gutter={[35, 35]}>
      {Array.from({ length: 3 }, (_, index) => (
        <Col key={index} xs={24} sm={12} md={12} lg={8} xl={8}>
          <Flex vertical gap={16}>
            <Skeleton active />
            <Flex justify="space-evenly">
              <Skeleton.Node active />
              <Skeleton.Node active />
            </Flex>
            <Skeleton active />
          </Flex>
        </Col>
      ))}
    </Row>
  );
};
type AIPromptListProps = {
  onOpenModalEdit: () => void;
  onOpenModalSchedule: (aiPromptId: string) => void;
};
const AIPromptList: React.FC<AIPromptListProps> = ({
  onOpenModalEdit,
  onOpenModalSchedule,
}) => {
  const { loading, prompts } = useAppSelector(
    (state: RootState) => state.aiPrompt
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        dispatch(getPromptStart());
        const { prompts } = await getAllPromptsAsync();
        dispatch(getPromptSuccess(prompts));
      } catch (error: any) {
        console.log(error);
        dispatch(getPromptFailure(error.message));
      }
    };
    const timeout = setTimeout(() => {
      fetchPrompt();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonListCard />
      ) : (
        <List
          grid={{
            gutter: [35, 35],
            column: 4,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={prompts}
          renderItem={(prompt) => (
            <List.Item>
              <AIPromptCard
                {...prompt}
                onOpenModalEdit={onOpenModalEdit}
                onOpenModalSchedule={onOpenModalSchedule}
              />
            </List.Item>
          )}
        />
      )}
      {prompts.length == 0 ? (
        <></>
      ) : (
        <Pagination
          align="center"
          // onChange={onChangePage}
          // current={currentPage}
          // total={totalPage}
        />
      )}
    </>
  );
};

export default AIPromptList;
